# Grouper
for deviding classmates into seperated groups(in order to compose presentation on Computer Network class)  
  
using nodejs/express on server side  
using material design lite on frontend  
using md5 with time seed generated token to provent csrf or any other attack  


## build  
npm install  
node index.js  

## manual
modify LIST in index.js to change groups' name  
modify start in index.js to change the beginning of available time  
modify choiceStatus[i] in for loop to change the limit number of every group  
visit http://localhost:3000/ to use  
check access.log, login.log, record.log to look up current records  

## status  
deprecated  
