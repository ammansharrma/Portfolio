@echo off
echo Starting copy...
xcopy "src\assets\Mockups" "public\Mockups" /E /I /Y
echo Copy finished.
dir "public\Mockups"
