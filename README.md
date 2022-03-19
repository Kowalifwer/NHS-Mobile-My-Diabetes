# MyDiabetesInfo

This app is specifically designed patients of the NHS who have been diagnosed with diabetes. The app will allow the user work with three different diaries - glucose, food, blood pressure - to manage and maintain their health. They can share their diaries with Health Officials or anybody else in a secure manner. There is a section for the patient to watch videos if they need help with the app.

## Important Information

Since the app contains videos hosted on Youtube, we used an API to fetch the video id's from a specific YouTube channel. This API features 300 API calls for free. If all the API calls have been used the application will not allow you to enter specific sections which feature the videos. These sections will keep showing the Alert message **Videos are loading**. On start up of homepage this pop up will be shown:

INSERT IMAGE OF POP UP

Therefore, before continuing check the number of API calls left with this website [noCodeAPI](https://app.nocodeapi.com/settings/)

**NOTE:** The sign in information for this website has been provided. Please refer to that to gain access. More information about this can be found in the [Videos](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main/-/wikis/Videos) section of the Wiki.

## How to Run App Locally 
The app can be run locally on your computer using react native and expo. The project files can be found either via **_GitLab_** or via the **_zipped folder_** sent to Customer.

### **Prerequisites**
* **GIT**  For cloning the GitLab Repository. (***Still Required even if using zipped folder. Will be used later on apart from Git Clone command***)
* **Node** For installing and running the project files. (***We developed the project with version 16.14.2 LTS***)
* **IDE** We suggest using **Visual Studio Code** for this. This will allow you to view, edit and run the project. We will give instructions for VS Code but feel free to use whatever IDE you are comfortable with.

### Windows Prerequisites
* Check if **GIT** is installed by going to the Command Prompt (CMD) and typing:

```bash
git --version
```

* If **GIT** is installed it will return the git version. If returned ***'git' is not recognised*** then install [**GIT**](https://git-scm.com/download/win) from [https://git-scm.com/download/win](https://git-scm.com/download/win)

* Next check if **Node** is installed by typing in Command Prompt (CMD):
```bash
node --version
```

* If **Node** is installed it will return the node version. If returned ***'node' is not recognised*** then install [**Node**](https://nodejs.org/en/) from [https://nodejs.org/en/](https://nodejs.org/en/). (***we used version 16.14.2 LTS***) Follow the instructions given. *Note: Installation may take a few minutes.*

* After **Node** has ***completed*** installing then **OPEN a new** Command Prompt (CMD) and install **expo** by typing:
```bash
npm install -g expo-cli
```

* *If this line does not work for you then you may need to restart your computer to allow **Node** to be fully installed.*
* This will also take a few minutes to install so be patient.

* We are now going to install an **IDE** to be able to view, edit and run the project. Instructions for **Visual Studio Code** is given below.
* Go to this link [https://code.visualstudio.com/download](https://code.visualstudio.com/download) to install **VS Code**. Select the operating system you are using and follow the instructions on screen.

* After this has installed, we will get the get the project files. If you are getting the files from **GitLab** then follow the next instruction. Otherwise, skip the **GitLab Clone Instructions** and move on to the **Zipped Folder Instructions.**

#### GitLab Clone Instructions

* ***Note: You need to have accepted the invitation to the GitLab and know your email and password login to be able to clone from GIT.*** You are going to clone the project files from GitLab to a location of your choice. In the following lines we are going to store the project files in Desktop/CS27 folder ***(CS27 is a empty folder in desktop).*** So in a Command Prompt (CMD) type:
```bash
cd Desktop/CS27
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main.git
```
* It will then ask for your GitLab credentials. Enter your email and password and then it should let you clone the repository to the CS27 folder in Desktop.
* After you have cloned it inside your chosen folder, you should then follow the **Run App Locally** Instructions.

#### Zipped Folder Instructions

* If you opt to skip getting the project files from GitLab and instead choose to use this method then follow these instructions
* Take the zipped folder and place it in your preferred location. In this exammple, we are going to place it on **Desktop**.
* Once placed in desired location, **right click** the folder and click **Extract Here**. This should create a **unzipped folder** and also put in the same location. For us it is in **Desktop**.
  * ***NOTE*** *: the file should be called ***cs27-main-master**** 
* After this step you are now ready to move on to the **Running App Locally** Instructions part of this readme file.

### macOS Prerequisites
* Check if **GIT** is installed by going to the **Terminal** and typing:
  * *Terminal can be accessed via **spotlight** search by simultaneously clicking **command** and **space bar** on keyboard and searching for **terminal***

```bash
git --version
```

* If **GIT** is installed it will return the git version and you can move on to the installing **node**. Otherwise, if a version is not returned then install **GIT** by typing this in **terminal**:
  * ***NOTE*** *: this method may ask for macOS user password as you are downloading a package with the root user. Just enter your password so the package can be installed if asked.*
```
sudo apt-get install git
```

* Next check if **Node** is installed by typing in **Terminal**:
```bash
node --version
```

* If **Node** is installed it will return the node version. If version is not returned then install [**Node**](https://nodejs.org/en/) from [https://nodejs.org/en/](https://nodejs.org/en/). (***we used version 16.14.2 LTS***) Follow the instructions given. *Note: Installation may take a few minutes.*

* After **Node** has ***completed*** installing then **OPEN a new** **terminal** and install **expo** by typing: 
  * *This will also take a few minutes to install so be patient*:
```bash
npm install -g expo-cli
```
* *If this line does not work for you then you may need to restart your computer to allow **Node** to be fully installed.*
  * **IF ERR! (errors) are shown in your terminal then try installing expo as sudo user:** *Once again this may require your password*
```
sudo npm install -g expo-cli
```

* We are now going to install an **IDE** to be able to view, edit and run the project. Instructions for **Visual Studio Code** is given below.
* Go to this link [https://code.visualstudio.com/download](https://code.visualstudio.com/download) to install **VS Code**. Select the operating system you are using and follow the instructions on screen.

* After this has installed, we will get the get the project files. If you are getting the files from **GitLab** then follow the next instruction. Otherwise, skip the **GitLab Clone Instructions** and move on to the **Zipped Folder Instructions.**

#### GitLab Clone Instructions

* ***Note: You need to have accepted the invitation to the GitLab and know your email and password login to be able to clone from GIT.*** You are going to clone the project files from GitLab to a location of your choice. In the following lines we are going to store the project files in Desktop/CS27 folder ***(CS27 is a empty folder in desktop).*** So in a **terminal** type:
```bash
cd Desktop/CS27
git clone https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main.git
```
* It will then ask for your GitLab credentials. Enter your email and password and then it should let you clone the repository to the CS27 folder in Desktop.
* After you have cloned it inside your chosen folder, you should then follow the **Run App Locally** Instructions.

#### Zipped Folder Instructions

* If you opt to skip getting the project files from GitLab and instead choose to use this method then follow these instructions
* Take the zipped folder and place it in your preferred location. In this exammple, we are going to place it on **Desktop**.
* Once placed in desired location, **double left click** the zipped folder and this should create a **unzipped folder** and also put in the same location. For us it is in **Desktop**.
  * ***NOTE*** *: the file should be called ***cs27-main-master****
* After this step you are now ready to move on to the **Running App Locally** Instructions part of this readme file.


### Running App Locally (Windows & macOS)
* Now that you have the project files, it's time to open it in **Visual Studio Code.** Open VS Code and then follow the next instruction. ***Note: Visual Studio Code can be found either in your Desktop or:***
  * ***Windows:*** by clicking the Start Menu Button (Bottom Left of Screen) and searching for "Visual Studio Code" in the Search Bar.
  * ***macOS:*** by searching in ***spotlight*** by clicking ***command*** and ***space bar*** at the **same** time and searching for **Visual Studio Code**
* Once opened click **File** on the top left then click **Open Folder** and then navigate to the file location you either **git cloned** or have **unzipped** the Zipped Folder. Click on the **cs27-main OR** the **UNZIPPED cs27-main-master** folder *(name depends on if you used the Git Clone method or Zipped Folder)* and then click **Select Folder**.
* Visual Studio Code will now ask if you trust the authors of the files in the folder so click **Yes, I trust the authors** button. ***Note: This may not appear for you and if not don't worry, it's fine.***
* Notice now in the sidebar on the left the project files have been loaded in. We are now going to open a terminal in VS Code so we can run the app locally. So, click on **Terminal** on the navigation bar on the top of the VS Code and then click **New Terminal**. This should have made a new terminal on the bottom of the VS Code screen.
* If you look near the top right of this terminal it should say **powershell** and there should be a ****+**** sign and a **v** symbol next to it. Click the **v** and click **Git Bash**. 

***NOTE*** *if you do not have this option then it is because you did not install **GIT** as instructed above. Close VS Code and install GIT from the above instructions. Afterwards follow the **Running App Locally Instructions** again.*


* We need to change directory to the **nhs_mobile** folder which stores all the project files and then we will install the project dependencies and run expo to start the project. Run the following commands one by one in the **Git Bash** terminal:
* **NOTE: IF** any pop up appears and asks to allow something then click **Allow Access** otherwise you cannot run the app.
```bash
cd nhs_mobile
npm install
expo start
```
* After running *expo start* **IF** a QR code is **NOT** shown in the terminal and an **error** is shown then in the terminal run ***npm audit fix*** and afterwards run ***expo start***. Otherwise, follow the next instruction.
* You now need to install the **Expo GO** App on your **device**. 
   * If you are using an **iPhone** then go to the **App Store** and search for **Expo Go** and install it. 
     * Next go to your phones **camera app** and open it and **scan** the **QR Code** shown on the terminal and open it. *Note you may need to resize or scroll through the terminal to make sure the full QR Code is visible.*
     * It should now open the **Expo Go** App and open the app. **Accept** any permissions it requires and you should now be able to use the app locally!
  * If you are using an **Android** then go to the **Play Store** and search for **Expo Go** and install it.
    * Afterwards, open the **Expo Go** app and click on **Scan QR Code** and scan the **QR Code** shown on the terminal. **Accept** any permissions it requires and you should be able to use the app locally!

  * **IF for some reason scanning the QR Code does not work** then on the same computer you are running VS Code, open a browser and type **http://localhost:19002** and after page has loaded near the ***bottom left*** click on **Tunnel** button. On the screen **wait** until it says **Tunnel ready**. *NOTE: this could take some time depending on your internet speed.*
       * Now, depending on if you have an **iPhone** or **Android** follow the instruction above but this time scan the **QR Code** given by the **webpage**. You should now be able to use the app locally!

## How to Share Expo QR Code to Other Users
* You need to follow above instructions of **How to Run App Locally** and in the end when a **QR Code** is shown on the **Visual Studio Terminal** you go to a **web browser** on the same device as VS Code and go to this website **http://localhost:19002**
* Afterwards, near the **bottom left** of this webpage click the **Tunnel** button and wait until it says **Tunnel ready** on the screen. Now you can share the **QR Code** shown on the **webpage** to whoever you want and they should be able to access your app via the **Expo Go** App. (*instructions to install Expo Go App given in How to Run App Locally Section*) 

## How to Replace Video API Link in the App
This section describes how to link your **YouTube account** with noCodeAPI and put the new API link in the app so everything works.

First we will start with registration of the noCodeAPI account and then linking it with YouTube Account. *Use your current youtube account or create a new one for this app*

* Go to [noCodeAPI](https://nocodeapi.com/) website *(https://nocodeapi.com/)* and click **Try for free**
* Either click **Login with Google** or create an account by entering a **Email** and **Password**.
* Afterwards, enter a **unique username**. This will be used in the API URL.
* On the sidebar on the left side, click **Marketplace** and look for **Youtube** and click **Activate** on it.
* Next, click **Create Youtube API** and then click **Authenticate**. This section will ask you to login to the youtube account which hosts the videos to be used in the app and will link it to the API.
* After linking to YouTube, a sidebar should appear from the left side and ask you to select a **account** and to **give it a name**. Since, you just link your YouTube account there should be only **one** account and it may appear as **Untitled - added a few seconds ago**. **Select** this and give it a name. Finally, click **Create**
* You should now have a page which shows the API followed by a **link**. Now click, **Use this API**. To ensure only the Channel Videos is picked up by the API, click **Channel Videos** on the left and then click **Params**. Make **sure** to enter **50** in the input field for **maxResults** and hit **enter** on your keyboard so the link is updated with this parameter.
* You should now get a **green** box appearing and it should look something like this: **https://v1.nocodeapi.com/name/yt/randomLetters/channelVideos?maxResults=50**
* Copy this and now go to **Visual Studio Code** *(or whatever IDE you prefer to use to open the package)*. As learned from the **How to Run App Locally** section open folder of project and from the left sidebar navigate to **nhs_mobile -> src -> screens -> Home.js** Double Click Home.js so it opens in VS Code.
* Find the line which contains the old API Link ***(it should look like your link but different)*** and replace that link and paste yours. **Ensure it is surrounded in quotation marks and you only replace that link**
* **Save** your file and run **expo start** in VS Code **terminal**. *(As learned from the How to Run the App Locally section)*. Also ensure you are in the **nhs_mobile** directory when running the expo start command. The app should now have the videos from your youtube channel throughout the app. Test first by clicking **Videos** Button on Homepage of the app.
* **IMPORTANT** as the Videos section of the app shows all videos in the youtube channel it is not important to have the correct names on videos. BUT, **video names** are **important** for showing a specific video in different parts of the app. **REFER TO BELOW (How to Change Videos in the App) SECTION TO CHANGE NAMES OTHERWISE SECTIONS IN APP WITH WRONG VIDEO NAME WONT WORK**  

## How to Change Videos in the App
This section shows what sections of the app feature specific videos and how to edit them. The screens which have specific videos are:
* **BPDiary.js** - can be found by navigating from sidebar to this path: **nhs_mobile -> src -> screens -> diaries -> BPDiary.js**
* **FoodDiary.js** - can be found by navigating from sidebar to this path: **nhs_mobile -> src -> screens -> diaries -> FoodDiary.js**
* **GlucoseDiary.js** - can be found by navigating from sidebar to this path: **nhs_mobile -> src -> screens -> diaries -> GlucoseDiary.js**
* **Email.js** - can be found by navigating from sidebar to this path: **nhs_mobile -> src -> screens -> Email.js**
* **Results.js** - can be found by navigating from sidebar to this path: **nhs_mobile -> src -> screens -> Results.js**

Now, we need to navigate and double click any of these files to change the names of the videos that will be shown in this section.

**IMPORTANT: the name of videos used in these sections must match exactly with the name of the video on the YouTube Channel. CASE SENSITIVE**

So, go to any of these sections and find the code which is inside a **useEffect()** block. The exact code should be **findVideoIndex**. This is a function. Inside the brackets replace the text with the **exact** name of the **video on YouTube**. So for example, in **BPDiary.js** inside the useEffect block the function for the video looks like **findVideoIndex("Blood Pressure Diary"**). 
* **ENSURE** your video name is inside the **Quote Marks** in the **brackets** of the **findVideoIndex** function. Also, make sure ton **save** your files so the changes are reflected in the app.

## How to Change Resources Section in the App
Open chosen **IDE**. We are giving example with **Visual Studio Code**. Open the project as instructed in the **How to Run the App Locally** section and from the sidebar navigation to **nhs_mobile -> src -> screens -> Resources.js**. Double click **Resources.js** so it opens in VS Code. Check the comments in the code which describe what to do to enter text in this page.

## Overview of File Structure and Description of each File in the App
1. **Authentication.js** When the app is launched for the first time after downloading, or relaunched after shutting down, Auth screen is the first thing the user sees, it launches a biometric authenticator and the user has 5 attempts to log in.
2. **ProfileSetup.js** If you’re launching the app for the first time, after authenticating you will be navigated to the profile set up screen. On this screen the user is supposed to put his NHS number and the type of his diabetes. After the that the user inputs his personal info and his medication. User can also setup his clinicians email.
3. **Home.js** After setting up the profile, the user is taken to the home page where he is greeted and there are multiple sections he can choose to visit.
4. **diaries** folder - This page is where the user is shown the option to add data to his three diaries. 
5. **FoodDiary.js** - This is the page where the user inputs his food. At the start of the page there is a help button which when clicked, will the the user how to fill in the diary. The user can then fill in the diary by choosing options and typing in the food and values or scanning a barcode and inputting those values. User can add multiple meals and multiple entries in one go
6. **BPDiary.js** Just like the food diary, there is a help button which when clicked will show the user a video. The user then selects the arm used for reading, inputs the reading and enters time of the reading. User can input multiple entries in one go
7. **GlucoseDiary.js** Just like the food diary, there is a help button which when clicked will show the user a video. The user then selects date and time of reading, and enters the value of his sugar level. From the same page, the user also inputs his insulin shot data.
8. **Email.js** Again there is a help button that shows a video on how to email. The user can then select the diary/diaries and the doctor he wants to email to. After this the user can choose to compose email and before he can, he is greeted with an auth call to authenticate the sending of the email along with a disclaimer. On this page the user can also set up email recipients.
9. **Videos.js** The videos page contains all the videos a user will need to in order to know how to use the app. The app displays the title of the video and then the video it self. The videos use an external api thus will require internet connection.
10. **Resources.js** this page shows the info about the medications that the user uses, it shows the side effects format at the moment. Yet to be implemented.
11. **Settings.js** this page has e options, to update and view profile details, setup email recipients, WIPE DATA.
12. **EmailSetup.js** on this page the user can choose to add multiple clinicians emails that he can choose to send his diaries to. He can also remove the email recipients. Both these actions need to be authenticated.

## Built With
* [React Native](https://reactnative.dev/) - The Expo Version was used to create the whole app

## Authors
* **Keivan Shooshtarian**
* **Yash Srivastava**
* **Callen Johnston-Adams**
* **Artem Grechushkin**



## License
[MIT](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main/-/blob/master/LICENSE) was the license the project was under. Click for details or go to project files and find the file called License.
