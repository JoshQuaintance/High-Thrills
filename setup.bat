REM  This is the Escape character needed to use colors
ECHO OFF
CLS
ECHO [92m
ECHO #############################
ECHO # Executing Setup Script... #
ECHO #############################
ECHO [0m

IF exist ./server (
    ECHO Found server directory
    ECHO Change directory
    CD server

    IF exist ./index.js (
        ECHO index.js Found
        ECHO Checking for node and npm

        node -version >nul 2>&1 && (
            ECHO [92mFound Node[0m
            GOTO installDep
        ) || (
            SET /p "Input=Cannot find node, do you want to install it? [Y/n]:" || SET "Input=y"
            IF /I "%Input%" EQU "y" (
                ECHO Downloading Files - NodeJS v14.15.1 with latest npm
                curl https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi -o node-v14.15.1.msi

                ECHO [0mInstalling - NodeJS v14.15.1 with latest npm
                ECHO [97m[102mIMPORTANT: Make Sure You Click Next On Everything In The Installation[0m
                START /WAIT node-v14.15.1.msi
                DEL node-v14.15.1.msi

                GOTO installDep
            ) 
            IF /I "%Input%" EQU "n" (
                ECHO NodeJS will not be installed, Exiting now...
                ECHO ########################################################
                ECHO #                [107m[91mIMPORTANT REMINDER[0m                    #
                ECHO #                                                      #
                ECHO #       THE WEB APP CANNOT RUN WITHOUT THE SETUP       #
                ECHO #  EITHER MANUALLY OR AUTOMATICALLY USING THIS SCRIPT  #
                ECHO ########################################################
                EXIT /B
            )
            

        )

        :installDep
            SET /p "Input=Do you want to install for [p] Production or [d] Development [P/d]:" || SET "Input=p"
            if /I "%Input%" EQU "p" (
                ECHO Installing dependencies only for production...
                npm i -prod
            )
            if /I "%Input%" EQU "d" (
                ECHO Installing all dependencies for development...
                npm i
            )

    ) ELSE (
        ECHO [91m[107mCannot find index.js file[0m

    )
) ELSE (
    ECHO [91m[107mCannot find server directory[0m

)