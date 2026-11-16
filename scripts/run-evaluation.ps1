$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  node scripts/start-qa.mjs --check
  if ($LASTEXITCODE -ne 0) { throw 'Falta completar la configuracion de evaluacion.' }
  foreach ($role in @('COMPANY','CANDIDATE')) {
    $label = if ($role -eq 'COMPANY') { 'empresa.qa@example.com' } else { 'candidata.qa@example.com' }
    $secret = Read-Host "Clave de $label (oculta)" -AsSecureString
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
    try {
      [Environment]::SetEnvironmentVariable("QA_${role}_PASSWORD", [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer), 'Process')
    } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
  }
  $env:NODE_PATH = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
  node scripts/run-evaluation.mjs
  if ($LASTEXITCODE -ne 0) { throw 'La prueba informo un error. Conservar el resultado para revision.' }
} finally {
  foreach ($role in @('COMPANY','CANDIDATE')) {
    [Environment]::SetEnvironmentVariable("QA_${role}_PASSWORD", $null, 'Process')
  }
  Pop-Location
}
