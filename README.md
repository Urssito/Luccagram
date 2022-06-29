# luccagram

#### Luccagram is a social network (currently under development) built with Express.js, React and MongoDB. developed by Lucca Urso, a 20 year old Argentine programmer as a personal project.

## How to launch  
 
1. Install dependencies on root directory
    ```shell
    npm install
    ```
2. Install React dependencies
    ```shell
    cd src/app
    npm install
    ```

3. set enviroment variables
    - make .env file on root directory
    - set values of the following variables:
        ```env
        CLIENT_HOST=  // server host url
        MONGO_DB=     // mongo database uri
        ```
    - add this variable:
        ```env
        DEFAULT_PROFILE_PHOTO=src/app/public/img/main/profilePhoto.jpg
        ```

4. set React enviroment variables
    - make .env file on ``` src/app```
    - set this values
        ```env
        REACT_APP_HOST=   // react development server url
        REACT_APP_SERVER= // server host url
        REACT_APP_SOCKET= // socket server url

5. on root directory run:
    ```shell
    npm run dev
    ```

6. on ```src/app``` run:
    ```shell
    npm run start
    ```

7. Enjoy your own social network!