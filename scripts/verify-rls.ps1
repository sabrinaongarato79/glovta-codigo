# Run from Glovta workspace. Credentials exist only in this process environment.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $PSScriptRoot)
try {
  Write-Host 'Usá las dos cuentas de prueba. Se conserva el perfil existente.'
  foreach ($qaName in @('A','B')) {
    [Environment]::SetEnvironmentVariable("QA_EMAIL_$qaName", (Read-Host "Correo de la cuenta QA $qaName"), 'Process')
    $qaSecure = Read-Host "Contraseña de QA $qaName (oculta)" -AsSecureString
    $qaPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($qaSecure)
    try { [Environment]::SetEnvironmentVariable("QA_PASSWORD_$qaName", [Runtime.InteropServices.Marshal]::PtrToStringBSTR($qaPtr), 'Process') }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($qaPtr) }
  }
  node --env-file=.env scripts/verify-rls.mjs
} finally {
  foreach ($qaVar in @('QA_EMAIL_A','QA_EMAIL_B','QA_PASSWORD_A','QA_PASSWORD_B')) { [Environment]::SetEnvironmentVariable($qaVar, $null, 'Process') }
  Pop-Location
}
