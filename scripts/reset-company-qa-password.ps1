param([ValidateSet('empresa', 'candidata')][string]$Cuenta = 'empresa')
$ErrorActionPreference = 'Stop'
function Read-HiddenValue([string]$label) {
  $secret = Read-Host $label -AsSecureString
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer); $secret.Dispose() }
}

Write-Host "Cambiar solo la clave de $Cuenta.qa@example.com en glovta-evaluacion."
Write-Host 'No se elimina la cuenta. Guarda tu nueva clave en tu gestor de contrasenas.'
$qaProcess = $null
$qaInput = $null
$qaJson = $null
try {
  $qaInput = @{
    account = $Cuenta
    key = Read-HiddenValue 'Clave administrativa de glovta-evaluacion (oculta)'
    password = Read-HiddenValue "Nueva clave de $Cuenta, minimo 12 caracteres (oculta)"
    confirm = Read-HiddenValue 'Repetir nueva clave (oculta)'
  }
  $qaJson = $qaInput | ConvertTo-Json -Compress
  $qaStart = New-Object System.Diagnostics.ProcessStartInfo
  $qaStart.FileName = (Get-Command node -CommandType Application | Select-Object -First 1).Source
  $qaStart.Arguments = '"' + (Join-Path $PSScriptRoot 'reset-company-qa-password.mjs') + '"'
  $qaStart.UseShellExecute = $false
  $qaStart.RedirectStandardInput = $true
  $qaStart.RedirectStandardOutput = $true
  $qaStart.RedirectStandardError = $true
  $qaStart.CreateNoWindow = $true
  $qaProcess = New-Object System.Diagnostics.Process
  $qaProcess.StartInfo = $qaStart
  [void]$qaProcess.Start()
  $qaOutputTask = $qaProcess.StandardOutput.ReadToEndAsync()
  $qaErrorTask = $qaProcess.StandardError.ReadToEndAsync()
  # Windows PowerShell 5.1 lacks ProcessStartInfo.StandardInputEncoding.
  # Write UTF-8 bytes directly, preserving non-ASCII password characters.
  $qaBytes = [System.Text.Encoding]::UTF8.GetBytes($qaJson)
  try {
    $qaProcess.StandardInput.BaseStream.Write($qaBytes, 0, $qaBytes.Length)
    $qaProcess.StandardInput.BaseStream.Flush()
  } finally { [Array]::Clear($qaBytes, 0, $qaBytes.Length) }
  $qaProcess.StandardInput.Close()
  $qaProcess.WaitForExit()
  $qaOutput = $qaOutputTask.GetAwaiter().GetResult()
  $qaError = $qaErrorTask.GetAwaiter().GetResult()
  # Redact entered values even if an unexpected runtime error echoes input.
  foreach ($qaValue in @($qaInput.key, $qaInput.password, $qaInput.confirm)) {
    if (-not [string]::IsNullOrEmpty($qaValue)) {
      $qaOutput = $qaOutput.Replace($qaValue, '[OCULTO]')
      $qaError = $qaError.Replace($qaValue, '[OCULTO]')
    }
  }
  if (-not [string]::IsNullOrWhiteSpace($qaOutput)) { Write-Host $qaOutput.Trim() }
  if (-not [string]::IsNullOrWhiteSpace($qaError)) { Write-Host ('Detalle: ' + $qaError.Trim()) }
  if ($qaProcess.ExitCode -ne 0) { throw 'Cambio no confirmado. Comparte solo el mensaje final, sin claves.' }
} finally {
  if ($null -ne $qaInput) { $qaInput.Clear() }
  $qaJson = $null
  if ($null -ne $qaProcess) { $qaProcess.Dispose() }
}
