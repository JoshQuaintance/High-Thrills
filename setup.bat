ECHO OFF
cls
ECHO #############################
ECHO # Executing Setup Script... #
ECHO #############################

if exist ./server (
    echo Found server directory
    echo Change directory
    cd server

    if exist ./index.js (
        echo index.js Found
        echo Checking for node and npm

        node -version >nul 2>&1 && (
            echo Found Node
            goto installDep
        ) || (
            set /p Input=Cannot find node, do you want to install it? [y/n]:
            if /I "%Input%" EQU "y" (
                echo Downloading Files - NodeJS v14.15.1 with latest npm
                curl https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi -o node-v14.15.1.msi

                echo Installing - NodeJS v14.15.1 with latest npm
                echo IMPORTANT: Make Sure You Click Next On Everything In The Installation
                START /WAIT node-v14.15.1.msi
                DEL node-v14.15.1.msi

                goto installDep
            ) else if /I "%Input%" EQU "n" (
                echo NodeJS will not be installed, Exiting now...
                EXIT /B
            )

        )

        :installDep
            npm run setup

    ) else (
        echo Cannot find index.js file

    )
) else (
    echo Cannot find server directory

)