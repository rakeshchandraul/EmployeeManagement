import { Component,OnInit, ViewChild } from '@angular/core';
import * as xml2js from 'xml2js';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {CommonService} from './common.service';
export interface Employee {
  ID: number;
  Name: string;
  Age: number;
  BloodGroup: string;
  Contact : number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  table = false;
  displayedColumns: string[] = ['ID', 'Name', 'Age', 'BloodGroup', 'Contact'];
  dataSource: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private commonService : CommonService)
  {
    
  }

  ngOnInit() {
    let self = this;
    this.commonService.GetEmployee().subscribe(data => {
      const emplist = Array.from({length: data.length}, (_, k) => createNewUser(data[k]));
      self.dataSource = new MatTableDataSource(emplist);
      this.table = true;
    });
    if(this.table){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  async Upload(event) {
    var file = event.target.files[0];
    await this.parse(file);
  }

  async parse(file) {
    var reader = new FileReader();
    var self = this;
      reader.readAsText(file);
      reader.onloadend = function(){
          var xmlData = reader.result;
          var parser = new xml2js.Parser();
          parser.parseString(xmlData, function(err, result){
            for(let key1 in result) {
              for(let key2 in result[key1]) {
                const emplist = Array.from({length: result[key1][key2].length}, (_, k) => createNewUser(result[key1][key2][k]));
                self.dataSource = new MatTableDataSource(emplist);
                self.commonService.PostEmployee(emplist).subscribe(obj => {
                  console.log('Record Inserted');
                });
              } 
              self.table = true;
            }
            if(self.table){
              self.dataSource.paginator = self.paginator;
              self.dataSource.sort = self.sort;
            }
          });
        }
  }
}

/** Builds and returns a new User. */
function createNewUser(element: Employee): Employee {
  return {
    ID: element.ID[0] ? element.ID[0] : element.ID,
    Name: element.Name[0] ? element.Name[0] : element.Name,
    Age: element.Age[0] ? element.Age[0] : element.Age,
    BloodGroup: element.BloodGroup[0] ? element.BloodGroup[0] : element.BloodGroup,
    Contact: element.Contact[0] ? element.Contact[0] : element.Contact,
  };
}