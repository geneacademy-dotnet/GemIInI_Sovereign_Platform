@echo off
echo ===================================================================
echo     LAUNCHING GEMIINI SOVEREIGN WEB PLATFORM (geneacademy.net)
echo ===================================================================
echo.
echo Starting local web server on port 8080...
echo Opening http://localhost:8080 in your default browser...
start http://localhost:8080
python -m http.server 8080
pause
