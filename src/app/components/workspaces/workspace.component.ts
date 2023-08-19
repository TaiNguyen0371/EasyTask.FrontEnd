import { Component, OnInit } from '@angular/core';
import { ITeam } from 'src/app/entities/team';
import { IWorkspace } from 'src/app/entities/workspace';
import axios from 'axios'
import { IUser } from 'src/app/entities/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  idUser: string = ''
  listUser: IUser[] = []
  teamList: ITeam[] = []
  workspaceList: IWorkspace[] = []
  workspaces = this.workspaceList
  isOpenAdd = false
  addWorkspaceName = ''
  searchFilter = ''
  constructor(private router: Router) {}
  ngOnInit(): void {
    const sessUser = sessionStorage.getItem('login')
    if(sessUser) this.idUser = JSON.parse(sessUser).idUser
    else this.router.navigate([''])
    axios
      .get(`http://localhost:3000/api/team/findByUser/${this.idUser}`)
      .then(response=>{
        this.teamList = response.data
      })
      .then(()=>{
        this.teamList.forEach(async team => { 
          await axios
            .get(`http://localhost:3000/api/workspace/findByTeam/${team._id}`)
            .then(response=>{
              this.workspaceList.push(...response.data)
            })
            .catch(error=>{
              console.log(error);
            })
        });
      })
      .catch(error=>{
        console.log(error)
      })
    axios 
      .get(`http://localhost:3000/api/user`)
      .then(response => {
        this.listUser.push(...response.data)
      })
      .catch(error => {
        console.log(error);
      })
  }
  addWorkspace() {
    this.isOpenAdd = !this.isOpenAdd
  }
  handleAdd() {
    axios
      .post('http://localhost:3000/api/team/add',{idLeader: this.idUser, idMembers: [this.idUser]})
      .then(response => {
        const data = response.data
        if(data.succes) return data.team
      })
      .then(team => {
        axios
          .post('http://localhost:3000/api/workspace/add',{name: this.addWorkspaceName, idTeam: team._id})
          .then(response => {
            const data = response.data
            if(data.succes) this.reload()
            else alert('Add fail')
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        console.log(error);
      })
  }
  reload() {
    const currentUrl = this.router.url;
    console.log(currentUrl);
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }
  deleteWorkspace(idWsp: string) {
    console.log(idWsp);
    axios
      .delete(`http://localhost:3000/api/workspace/delete/${idWsp}`)
      .then(response => {
        const data = response.data
        if(data.succes) this.reload()
        else alert('Delete fail')
      })
      .catch(error => {
        console.log(error);
      })
  }
  searchWorkspace() {
    this.workspaces = this.workspaceList.filter(wsp =>
      wsp.name.toLocaleLowerCase().includes(this.searchFilter.toLocaleLowerCase())
    )
  }
  getTeam(idWorkspace: string): string[] {
    const targetWorkspace = this.workspaceList.find(wsp=>wsp._id === idWorkspace)
    const arrName: string[] = []
    if(targetWorkspace){
      const targetList = this.teamList.find(team => team._id === targetWorkspace.idTeam)
      if(targetList) {
        let targetUser
        targetList.idMembers.forEach(user => {
          const targetUser = this.listUser.find(u => u._id === user)
          if(targetUser) {
            // arrName.push(targetUser.fullName)
            const arrNameSplit = targetUser.fullName.split(' ')
            arrName.push((arrNameSplit[0][0] + arrNameSplit[arrNameSplit.length-1][0]).toLocaleUpperCase())
          }
        });
        const finalList = arrName
        return finalList
      }
      return []
    }
    else return []
  }
}
