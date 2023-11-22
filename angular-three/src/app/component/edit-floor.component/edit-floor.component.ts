import { Component, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { FloorService } from '../../service/Floor/floor.service'
import { MessageService } from 'src/app/service/message/message.service';

@Component({
  selector: 'app-edit-floor',
  templateUrl: './edit-floor.component.html',
  styleUrls: ['./edit-floor.component.css']
})

export class EditFloorComponent implements OnInit {
  floor = {
    id: 0,
    name: 'Name',
    building: 0,
    description: 'Description',
    hall: 'Hall',
    room: 0,
    floorMap: 'Floor Map',
    hasElevator: false,
    passages: "Passages identifiers"
  };

  constructor(
    private location: Location,
    private floorService: FloorService,
    private messageService: MessageService
  ) { }

  @Output() finalMessage: string = '';

  ngOnInit(): void {
  }

  editFloor() {
    let errorOrSuccess: any = this.floorService.editFloor(this.floor);

    errorOrSuccess.subscribe(
      (data: any) => {
        //success
        this.messageService.add("Floor edited with success!");
        this.finalMessage = "Floor edited with success!";
        this.location.back();
      },
      
      (error: any) => {
        //error
        this.messageService.add(error.error.message);
        this.finalMessage = error.error.message;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}