# MyDiabetesInfo

This app is specifically designed patients of the NHS who have been diagnosed with diabetes. The app will allow the user work with three different diaries - glucose, food, blood pressure - to manage and maintain their health. They can share their diaries with Health Officials or anybody else in a secure manner. There is a section for the patient to watch videos if they need help with the app.

## Important Information

Since the app contains videos hosted on Youtube, we used an API to fetch the video id's from a specific YouTube channel. This API features 300 API calls for free. If all the API calls have been used the application will not allow you to enter specific sections which feature the videos. This pop up will be shown:

INSERT IMAGE OF POP UP

Therefore, before continuing check the number of API calls left with this website [noCodeAPI](https://app.nocodeapi.com/settings/)

**NOTE:** The sign in information for this website has been provided. Please refer to that to gain access. More information about this can be found in the [Videos](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main/-/wikis/Videos) section of the Wiki.

## How to Run App Locally 
The app can be run locally on your computer using react native and expo. The project files can be found either via **_GitLab_** or via the **_zipped folder_** sent to Customer.

### **Prerequisites**
* **GIT**  For cloning the GitLab Repository. (***Only Required if not using zipped folder***)
* **Node** For installing and running the project files. (***We developed the project with version 16.14.2 LTS***)

#### Windows
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

* After **Node** has ***completed*** installing then in Command Prompt (CMD) install **expo** by typing:
```bash
npm install -g expo-cli
```
* *If this line does not work for you then you may need to restart your computer to allow **Node** to be fully installed.*
*


#### macOS

### From GitLab
Ensure Prerequisites instruction has been followed first.


### From Zip Folder
Ensure Prerequisites instruction has been followed first.


Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.


vids wont wirrk unless api call is not maxed out

## Built With
* [React Native](https://reactnative.dev/) - The Expo Version was used to create the whole app

## Authors
* **Keivan Shooshtarian**
* **Yash Srivastava**
* **Callen Johnston-Adams**
* **Artem Grechushkin**



## License
[MIT](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs27/cs27-main/-/blob/master/LICENSE) was the license the project was under. Click for details.