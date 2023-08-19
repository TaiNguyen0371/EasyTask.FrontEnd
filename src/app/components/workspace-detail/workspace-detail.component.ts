import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import axios from 'axios';
import { IListTask } from 'src/app/entities/listTask';
import { ITask } from 'src/app/entities/task';
import { IUser } from 'src/app/entities/user';
import { IWorkspace } from 'src/app/entities/workspace';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html',
  styleUrls: ['./workspace-detail.component.css']
})
export class WorkspaceDetailComponent implements OnInit {
  idWorkspace = ''
  workspace: IWorkspace = {_id: '', name: '', idTeam: ''}; 
  userList: IUser[] = [];
  listTasks: IListTask[] = []
  // tasks: ITask[] = []
  isOpenAddList = false
  isOpenAddTask = false
  isOpenEditList = false
  isOpenEditTask = false
  addListName = ''
  formAddTask = {
    name: '',
    idList: '',
    color: '',
    idUser: '',
    description: ''
  }
  editListName = ''
  editListId = ''
  editTaskId = ''
  formEditTask = {
    name: '',
    idUser: '',
    color: '',
    idList: '',
    description: ''
  }
  constructor(private route: ActivatedRoute, private router: Router){}
  ngOnInit(): void {
    const sessUser = sessionStorage.getItem('login')
    if(!sessUser) this.router.navigate([''])
    // Handle Your Team
    this.idWorkspace = this.route.snapshot.params['id']
    axios
      .get(`http://localhost:3000/api/workspace/${this.idWorkspace}`)
      .then(response=>{
        this.workspace = response.data
      })
      .then(()=>{
        axios 
          .get(`http://localhost:3000/api/team/${this.workspace.idTeam}`)
          .then(response=>{
            let team = response.data
            return team.idMembers
          })
          .then(idUsers=>{
            idUsers.forEach((id:String) => {
              axios
                .get(`http://localhost:3000/api/user/${id}`)
                .then(response=>{
                  this.userList.push(response.data)
                })
                .catch(error=>{
                  console.log(error);
                })
            });
          })
          .catch(error=>{
            console.log(error);
          })
      })
      .catch(error=>{
        console.log(error);
      })

    //Handle Task

    axios
      .get(`http://localhost:3000/api/listtask/findByWorkspace/${this.idWorkspace}`)
      .then(response=>{
          this.listTasks.push(...response.data)
      })
      .then(()=>{
        this.listTasks.sort((lista,listb) => {
          if(lista.index>listb.index) return 1
          else return -1
        })
        this.listTasks.forEach(taskCol => {
          axios 
            .get(`http://localhost:3000/api/task/findByList/${taskCol._id}`)
            .then(response=>{
              const tasks = response.data.sort((lista: ITask,listb: ITask) => {
                if(lista.index>listb.index) return 1
                else return -1
              })
              taskCol.tasks = tasks
            })
            .catch(error=>{
              console.log(error);
            })
        });
      })
      .then(() => {
        console.log(this.listTasks);
        
      })
      .catch(error=>{
        console.log(error);
      })
  }
  getUser(idUser: string): string {
    const userObj = this.userList.find(user=>user._id==idUser)
    if(userObj){
      const userFullName = userObj.fullName
      const userSplit = userFullName.split(' ')
      const shortName = userSplit[0][0] + userSplit[userSplit.length-1][0]
      return shortName
    }
    else return ""
  }
  dropListTask(event: CdkDragDrop<string>): void {
    const targetList = this.listTasks[event.previousIndex]
    const exchangeList = this.listTasks[event.currentIndex]
    const targetListIndex = targetList.index
    console.log(targetList);
    console.log(exchangeList);
    
    axios
      .put(`http://localhost:3000/api/listtask/update/${targetList._id}`,{index: exchangeList.index})
      .then(response => {
        if(response.data.succes) return
        else console.log(response.data.notification);
      })
      .then(() => {
        axios
        .put(`http://localhost:3000/api/listtask/update/${exchangeList._id}`,{index: targetListIndex})
        .then(response => {
          if(response.data.succes) {
            moveItemInArray(this.listTasks, event.previousIndex, event.currentIndex);
          }
          else console.log(response.data.notification);
        })
      })
      .catch(error => {
        console.log(error);
      })
  }
  dropTask(event: CdkDragDrop<any>, idList: string): void {
    if (event.previousContainer === event.container) {
      const tasks = this.listTasks.find(list => list._id===idList)
      if(tasks) {
        const targetTask = tasks.tasks[event.previousIndex]
        const exchangeTask = tasks.tasks[event.currentIndex]
        const targetTaskIndex = targetTask.index
        axios
          .put(`http://localhost:3000/api/task/update/${targetTask._id}`, {index: exchangeTask.index})
          .then(response => {
            if(response.data.succes) {
              return
            }else{
              console.log("Update fail")
            }
          })
          .then(() => {
            axios
              .put(`http://localhost:3000/api/task/update/${exchangeTask._id}`, {index: targetTaskIndex})
              .then(response => {
                if(response.data.succes) {
                  moveItemInArray(tasks.tasks, event.previousIndex, event.currentIndex);
                }else{
                  console.log("Update fail")
                }
              })
              .catch(error => {
                console.log(error);
              })
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else { 
      axios
        .put(`http://localhost:3000/api/task/update/${event.item.data._id}`,
        {idList: event.container.id}
        )
        .then(response => {
          if(response.data.succes) {
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex,
            );
          }
        })
        .then(() => {

        })
        .catch(error => {
          console.log(error);
        })

    }
  }
  toggleContent(content: string, id?: string) {
    if(content == 'add-list') this.isOpenAddList = !this.isOpenAddList
    else if(content == 'add-task') {
      this.isOpenAddTask = !this.isOpenAddTask
      if(id) this.formAddTask.idList = id
    }
    else if(content == 'edit-list') {
      this.isOpenEditList = !this.isOpenEditList
      if(id) {
        const targetList = this.listTasks.find(list => list._id === id)
        this.editListId = id
        if(targetList) this.editListName = targetList.name
      }
    }
    else if(content == 'edit-task') {
      this.isOpenEditTask = !this.isOpenEditTask
      if(id) {
        this.editTaskId = id
        const targetList = this.listTasks.find(list => {
          return list.tasks.find(task => task._id === id)
        })
        if(targetList) {
          const targetTask = targetList.tasks.find(task => task._id === id)
          if(targetTask) this.formEditTask = targetTask
        }
      }
    }
  }
  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
  handleAddList() {
    axios
      .post('http://localhost:3000/api/listtask/add',{idWorkSpace: this.idWorkspace,name: this.addListName})
      .then(response => {
        const data = response.data
        if(data.succes) this.reload()
        else console.log(data.notification);
      })
      .catch(error => {
        console.log(error);
      })
  }
  handleAddTask() {
    axios
      .post('http://localhost:3000/api/task/add',this.formAddTask)
      .then(response => {
        const data = response.data
        if(data.succes) this.reload()
      })
      .catch(error => {
        console.log(error);
      })  
  }
  deleteList(idList: string) {
    axios
      .delete(`http://localhost:3000/api/listtask/delete/${idList}`)
      .then(response => {
        if(response.data.succes) this.reload()
        else alert(response.data.notification)
      })
      .catch(error => {
        console.log(error);
      })

  }
  deleteTask(idTask: string) {
    axios
      .delete(`http://localhost:3000/api/task/delete/${idTask}`)
      .then(response => {
        if(response.data.succes) this.reload()
        else alert(response.data.notification)
      })
      .catch(error => {
        console.log(error);
      })
  }
  handleEditList() {
    axios
      .put(`http://localhost:3000/api/listtask/update/${this.editListId}`, {name: this.editListName})
      .then(response => {
        if(response.data.succes) this.reload()
        else alert(response.data.notification)
      })
      .catch(error => {
        console.log(error);
      })
  }
  handleEditTask() {
    console.log(this.formEditTask);
    axios
      .put(`http://localhost:3000/api/task/update/${this.editTaskId}`,this.formEditTask)
      .then(response => {
        if(response.data.succes) this.reload()
        else alert(response.data.notification)
      })
      .catch(error => {
        console.log(error);
      })
  }
}
