@echo off
cd /d "%~dp0"
echo Iniciando GLOVTA en http://localhost:8080
python -m http.server 8080
pause
