# WhiteBoard
 This is the open ptoject under MARS @IIT Roorkee, given in the summer of 2025. The project is completed by me, Sidheshwar Sarangal, 22124041. It's a web development project. The problem statement was to develop a real-time collaborative whiteboard application that allows multiple users to draw, write, and interact simultaneously, replicating the experience of a physical whiteboard on the web.

---

## Deployed Website Link
You can put the credentails in two computer systems or in two browsers to check the implementation of the room joining and collaborative whiteborads.

I have these following credentials which can be used for testing. 

user - 

email: user@gmail.com

password: user


user1 -

email: user1@gmail.com

password: user

The backend is running on a free service so the signin can take a little time.

###[Live Website Link](https://white-board-git-main-sidheshwar-sarangals-projects.vercel.app/)

---

## Demo Video Link
[Live Demo Video](https://drive.google.com/file/d/1DpPIYJlPGhGRcVjevwMCVg_RP_osok-s/view?usp=sharing)

---

## Project Description

The project is real time collaborative whiteboard application which allows multiple users to draw, write and interact simultaneously. The whiteboard works in real time. The changes done by a user will be visible to all the users present in the room in real time and differnt users can edit (or view only in case of private room without password) and download the canvas.

---

## Feature/Funtionality

- The users can create accounts and sign in.
- The users can create a room where the white board is present.
- The rooms can be personal or private. For private rooms, the user has to mention password.
- The room opens after its creation and the user get to see the tool bar at the top, the moom members information on the left, the information about the room on the right and the drawing pane in the center.
- The room information in the right consists of unique room key which can be copied and the password if the room is private.
- Any other user with this room key can join the room.
- If the room is public, then there is no need of password by the other user. He can enter the room and is allowed to view and edit the drawing pane.
- If the room is private, then in order to join the room with editing allowance, he needs to enter the correct password.
- If he enters without submitting password or he enteres a wrong password, then he can only view the room and its information(except the room password).
- In edit mode, the user can use tools like pen, eraser, text, straight lines, rectangle and circles on the drawing pane. There is an option for color filling for rectangle and circle. There is a color picker. There is dropdown for choosing different size of the elements. There is option for undo and redo for that user. There is also an option to clear canvas whhich deletes all the information on the canvas(you cannot undo it). 
- The download as jpg, png and pdf option is available for both edit mode and read mode users.

---

## Tech Stack

- Used React.js (with Vite) for frontend and Node.js for backend.
- The database is MongoDB.
- The forntend hosted on Vercel and the backend on Render.
- Used socket.io for creating real time expriernce for white boards.
  
---

## To run the project locally

To run it locally-

Clone the repository
```bash
git clone https://github.com/SidheshwarSarangal/whiteBoard.git
```

In two differnt terminals do
```bash
cd frontend
npm install
npm run dev
```
```bash
cd backend
npm install
npm run dev
```
 With this you will be able to run the project locally.

---

 ## Demo Link
 
 You can run this live as well with the following link. It works completely.
 
 [Live Website](https://white-board-git-main-sidheshwar-sarangals-projects.vercel.app/)

---

Name-Sidheshwar Sarangal

Enrolment Number-22124041




