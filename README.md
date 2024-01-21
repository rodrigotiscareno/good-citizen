# **Welcome to the Good Citizen Application**

## **Problem Statement:** <br />

In an era where people sitting together on a bus do not acknowledge the presence of the person beside them as they scroll through social media, it is nearly impossible to connect with others around you without making it an awkward situation. Connecting with your neighbors, whether on a street or in an apartment building, has become even more difficult. <br />

## **Our Solution:** <br />

With the Good Citizen application, the lack of communication between neighbors in communities is addressed by building a platform aimed at building unity and trust among the community. People within a neighborhood will also be notified of any community events, incidents, and social occasions they can be a part of. Good Citizen automatically allocates members to a group with a geo-fencing strategy, including only relevant members to relevant community conversations. <br />

In addition, with its built-in, virtual map, users will be able to pinpoint events, gatherings, and incidents from a visual standpoint. Bringing the community closer through community-planned events, raised community incidents and warnings, and neighborhood-specific requests is the purpose of the Good Citizen application. This app will be focused towards neighborhood communities, however, the concept extends beyond neighborhoods and the vision is to introduce this app for any type of community, such as schools, associations, businesses, and more. <br />

## **Installation Instructions:** <br />

1. Clone the repository from GitHub:

```
git clone https://github.com/rodrigotiscareno/msci-342-project.git
```

2. Navigate into the project directory:

```
cd msci-342-project
```

3. Ensure you have the most recent version of our app

```
git pull # to pull our most recent changes
```

4. Install the required dependencies:

```
npm install --legacy-peer-deps # make sure this is in the root folder
cd client
npm install --legacy-peer-deps # make sure this is in the client folder
cd ../server
npm install --legacy-peer-deps # make sure this is for the server
```

5. Link Prisma ORM:

```
cd .. # make sure you're back in the root folder
npm run prisma
```

6. Start the application:

```
npm run dev # run this command while in the root folder
```

After launching the app in your browser, ensure you log in or sign up to access pages that require user authentication.

Feel free to reach out to any of our team members if you run into trouble with the installation. We hope you enjoy using our application!

Made with love by: <br />
[Devansh Kaloti](mailto:d2kaloti@uwaterloo.ca) <br/>
[Rodrigo Tiscareno](mailto:ctiscare@uwaterloo.ca) <br />
[Youssef Abadeer](mailto:yabadeer@uwaterloo.ca) <br />
[Inesh Jacob](mailto:ijacob@uwaterloo.ca)
