@echo Installing Node.js
node-v8.9.3-x86.msi
npm install npm --global
@echo.
@echo Setting up the project
@cd ..
npm install
@echo.
@echo Done!
@echo Start the server by running 'start.bat' file
