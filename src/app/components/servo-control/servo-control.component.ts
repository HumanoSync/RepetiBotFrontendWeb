import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HeaderComponent } from '../pages/header/header.component';
import { FooterComponent } from '../pages/footer/footer.component';
import { AdminService } from '../../services/roles/admin.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
const BASIC_URL = "https://humansyncbackend.onrender.com/";

@Component({
  selector: 'app-servo-control',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    HeaderComponent,
    FooterComponent,
    NgxDatatableModule
  ],
  templateUrl: './servo-control.component.html',
  styleUrls: [
    '/node_modules/@swimlane/ngx-datatable/index.css',
    '/node_modules/@swimlane/ngx-datatable/themes/material.css',
    '/node_modules/@swimlane/ngx-datatable/assets/icons.css',
    './servo-control.component.scss'
  ]
})


export class ServoControlComponent implements OnInit {

  robotDetail: any = null; // Inicializa como null o cualquier estructura adecuada

  showMovements: boolean = false;
  showUpdateMovementModal: boolean = false;
  showPositions: boolean = false;
  showUpdatePositionModal: boolean = false; // Controla la visibilidad del modal
  showDeletePositionModal: boolean = false; 
  showUpdateIncreasePositionModal: boolean = false;
  showUpdateDecreasePositionModal: boolean = false;
  showInitialPositionModal: boolean = false; // Controla la visibilidad del modal
  robotToken: string = ''; // Token del robot (dinámico)
  showRobotModal: boolean = false;
  showCurrentPositionModal: boolean = false;
  showSavePositionModal: boolean = false;
  showExecutePositionModal: boolean = false;
  showRobotGetModal: boolean = false;
  robots: any[] = []; 
  positions: any[] = []; 
  movements: any[] = []; // Almacena los movimientos obtenidos
  showModal: boolean = false; // Controla la visibilidad del modal
  delay: number = 0;
  anglesInput: string = '';
  movementId: number = 0;
  newRobotName: string = '';
  movementName: string = '';
  robotId: number | null = null;
  positionId: number | null = null;
  localStorageToken: string = ''; //
  robotDetails: any = {}; // Estructura inicial vacía


  constructor(
    private adminService: AdminService,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {


    this.robotToken = localStorage.getItem('robotToken') || ''; 
  }

  createRobot() {
    console.log("Creando robot...");
    const token = this.userStorageService.getToken();
    console.log("Token obtenido en ServoControlComponent:", token);

    if (!token) {
        console.error("No se encontró token, no se puede crear el robot.");
        return;
    }

    // `initial_position` y `current_position` deben estar en formato de array de números
    const request = {
        botname: this.newRobotName,
        initial_position: this.getCurrentServoPositions(),
        current_position: this.getCurrentServoPositions()
    };

    console.log("Datos enviados para la creación del robot:", request);

    this.adminService.createRobot(request).subscribe({
        next: response => {
            console.log('Robot creado:', response);
            this.newRobotName = '';  // Limpiar el nombre del robot después de crear
        },
        error: error => {
            console.error('Error en la creación del robot:', error);
        }
    });
  }




  
  






 
  getCurrentServoPositions(): number[] {
    // Ajusta esta función para devolver las posiciones actuales en formato de array de números
    return [90, 90, 90, 90]; // Ejemplo: todas las posiciones de servos en 90 grados
  }


  createMovement() {
    if (!this.movementName || this.robotId === null) {
      console.error("Nombre del movimiento o ID del robot faltante.");
      return;
    }

    const request = {
      name: this.movementName,
      robot_id: this.robotId
    };

    console.log("Datos enviados para la creación del movimiento:", request);

    this.adminService.createMovement(request).subscribe({
      next: response => {
        console.log('Movimiento creado:', response);
        this.movementName = '';  // Limpiar los campos después de crear
        this.robotId = null;
      },
      error: error => {
        console.error('Error en la creación del movimiento:', error);
      }
    });
  }




  createDelayAngles() {
    const anglesArray = this.anglesInput.split(',').map(angle => parseInt(angle.trim(), 10));
    
    const request = {
      delay: this.delay,
      angles: anglesArray,
      movement_id: this.movementId
    };

    console.log("Datos enviados para la creación del delay y ángulos:", request);

    this.adminService.createDelayAngles(request).subscribe({
      next: response => {
        console.log('Delay y ángulos creados:', response);
        this.resetForm();
      },
      error: error => {
        console.error('Error en la creación del delay y ángulos:', error);
      }
    });
  }

  private resetForm() {
    this.delay = 0;
    this.anglesInput = '';
    this.movementId = 0;
  }

  toggleMovementsModal(): void {
    this.getMovements();
    this.showMovements = !this.showMovements;
  }


 

  getMovements() {
    
    if (this.robotId) {  // Asegúrate de que robotId no es null
      this.adminService.getMovementsByRobotId(this.robotId).subscribe({
        next: (response) => {
          this.movements = response;
          console.log('Movimientos obtenidos:', this.movements);
        },
        error: (error) => {
          console.error('Error al obtener los movimientos:', error);
        }
      });
    } else {
      console.error('robotId no está definido');
    }
  }
  



  // Método para abrir/cerrar el modal de actualización de movimiento
  toggleUpdateMovementModal(): void {
    this.showUpdateMovementModal = !this.showUpdateMovementModal;
  }

  // Método para actualizar el movimiento
  updateMovement(): void {
    if (!this.movementId || !this.movementName.trim()) {
      console.error("ID del movimiento o nombre faltante.");
      return;
    }
  
    const request = { name: this.movementName };
    const url = `${BASIC_URL}api/v1/movement/update/${this.movementId}`;
  
    console.log('URL:', url);
    console.log('Token:', this.userStorageService.getToken());
    console.log('Datos enviados:', request);
  
    this.adminService.updateMovement(this.movementId, request).subscribe({
      next: response => {
        console.log('Movimiento actualizado:', response);
        this.toggleUpdateMovementModal();
      },
      error: error => {
        console.error('Error detallado:', error);
      }
    });
  }
  
  
  
showDeleteMovementModal: boolean = false; // Controla la visibilidad del modal de eliminación

// Método para abrir/cerrar el modal de eliminación
toggleDeleteMovementModal(): void {
  this.showDeleteMovementModal = !this.showDeleteMovementModal;
}

// Método para eliminar un movimiento
deleteMovement(): void {
  if (!this.movementId) {
    console.error("ID del movimiento faltante para eliminar.");
    return;
  }

  const confirmDelete = confirm(`¿Estás seguro de eliminar el movimiento con ID ${this.movementId}?`);
  if (!confirmDelete) {
    return;
  }

  this.adminService.deleteMovement(this.movementId).subscribe({
    next: (response) => {
      console.log(`Movimiento con ID ${this.movementId} eliminado:`, response);
      this.toggleDeleteMovementModal(); // Cerrar modal tras la eliminación
      this.getMovements(); // Actualizar lista de movimientos
    },
    error: (error) => {
      console.error('Error al eliminar el movimiento:', error);
    }
  });
}

togglePositionModal(): void {
  this.getPositons();
  this.showPositions = !this.showPositions;
}




getPositons() {
    
  if (this.movementId) {  // Asegúrate de que robotId no es null
    this.adminService.getMovementsByPositionId(this.movementId).subscribe({
      next: (response) => {
        this.positions = response;
        console.log('Movimientos obtenidos:', this.positions);
      },
      error: (error) => {
        console.error('Error al obtener los movimientos:', error);
      }
    });
  } else {
    console.error('robotId no está definido');
  }
}

// Alterna la visibilidad del modal de actualización
toggleUpdatePositionModal(): void {
  this.showUpdatePositionModal = !this.showUpdatePositionModal;
}

// Método para actualizar posición
updatePosition(): void {
  if (!this.positionId || this.delay === null || !this.anglesInput.trim()) {
    console.error("ID de la posición, retraso o ángulos faltantes.");
    return;
  }

  const anglesArray = this.anglesInput.split(',').map(angle => parseInt(angle.trim(), 10));
  const request = {
    delay: this.delay,
    angles: anglesArray
  };

  console.log("Datos enviados para la actualización de la posición:", request);

  this.adminService.updatePosition(this.positionId, request).subscribe({
    next: (response) => {
      console.log('Posición actualizada:', response);
      this.toggleUpdatePositionModal(); // Cierra el modal después de actualizar
    },
    error: (error) => {
      console.error('Error al actualizar la posición:', error);
    }
  });
}

toggleUpdateIncreasePositionModal(): void {
  this.showUpdateIncreasePositionModal = !this.showUpdateIncreasePositionModal;
}

// Método para actualizar posición
updatePositionIncrease(): void {
  if (!this.positionId) {
    console.error("ID de la posición faltante.");
    return;
  }

  this.adminService.updatePositionIncrease(this.positionId).subscribe({
    next: (response) => {
      console.log('Posición incrementada:', response);
      this.toggleUpdateIncreasePositionModal();
      this.getPositons(); // Refrescar la lista de posiciones
    },
    error: (error) => {
      console.error('Error al incrementar la posición:', error);
    }
  });
}





toggleUpdateDecreasePositionModal(): void {
  this.showUpdateDecreasePositionModal = !this.showUpdateDecreasePositionModal;
}

// Método para actualizar posición
updatePositionDecrease(): void {
  if (!this.positionId) {
    console.error("ID de la posición faltante.");
    return;
  }

  this.adminService.updatePositionDecrease(this.positionId).subscribe({
    next: (response) => {
      console.log('Posición decrementada:', response);
      this.toggleUpdateDecreasePositionModal();
      this.getPositons(); // Refrescar la lista de posiciones
    },
    error: (error) => {
      console.error('Error al disminuir la posición:', error);
    }
  });
}



toggleDeletePositionModal(): void {
  this.showDeletePositionModal = !this.showDeletePositionModal;
}

// Método para eliminar un movimiento
deletePosition(): void {
  if (!this.positionId) {
    console.error("ID de la posicion faltante para eliminar.");
    return;
  }

  const confirmDelete = confirm(`¿Estás seguro de eliminar la posicion con ID ${this.positionId}?`);
  if (!confirmDelete) {
    return;
  }

  this.adminService.deletePosition(this.positionId).subscribe({
    next: (response) => {
      console.log(`Posición con ID ${this.positionId} eliminado:`, response);
      this.toggleDeletePositionModal(); // Cerrar modal tras la eliminación
      this.getPositons(); // Actualizar lista de movimientos
    },
    error: (error) => {
      console.error('Error al eliminar la posicon: ', error);
    }
  });
}

toggleRobotModal(): void {
  this.getRobotDetails(),
  this.showRobotModal = !this.showRobotModal;
}



getRobotDetails(): void {
  if (!this.robotToken) {
    alert('Token del robot no encontrado.');
    return;
  }

  this.adminService.getRobotByToken(this.robotToken).subscribe({
    next: (response) => {
      if (response) {
        this.robotDetail = response; // Asegúrate de que la respuesta tiene datos válidos
        console.log('Detalles del robot obtenidos:', this.robotDetail);
      } else {
        console.warn('La respuesta no contiene datos del robot.');
      }
    },
    error: (error) => {
      console.error('Error al obtener los datos del robot:', error);
      alert('No se pudieron obtener los detalles del robot.');
    }
  });
}



toggleInitialPositionModal(): void {
  this.showInitialPositionModal = !this.showInitialPositionModal;
}

moveRobotToInitialPosition(): void {
  if (!this.robotToken) {
    alert('Token del robot no encontrado.');
    return;
  }

  this.adminService.moveToInitialPosition(this.robotToken).subscribe({
    next: (response) => {
      console.log("Robot movido a posición inicial:", response);
      alert("El robot se movió a su posición inicial exitosamente.");
      this.toggleInitialPositionModal(); // Cierra el modal
    },
    error: (error) => {
      console.error("Error al mover el robot a la posición inicial:", error);
      alert("Ocurrió un error al mover el robot.");
    }
  });
}


toggleCurrentPositionModal(): void {
  this.showCurrentPositionModal = !this.showCurrentPositionModal;
}

moveRobotToCurrentPosition(): void {
  if (!this.robotToken) {
    alert('Token del robot no encontrado.');
    return;
  }

  this.adminService.moveToCurrentPosition(this.robotToken).subscribe({
    next: (response) => {
      console.log("Robot movido a posición :", response);
      alert("El robot se movió a su posición  exitosamente.");
      this.toggleCurrentPositionModal(); // Cierra el modal
    },
    error: (error) => {
      console.error("Error al mover el robot a la posición :", error);
      alert("Ocurrió un error al mover el robot.");
    }
  });
}

toggleSavePositionModal(): void {
  this.showSavePositionModal = !this.showSavePositionModal;
}

moveRobotToSavePosition(): void {
  if (!this.robotToken) {
    alert('Token del robot no encontrado.');
    return;
  }

  this.adminService.moveToSavePosition(this.robotToken).subscribe({
    next: (response) => {
      console.log("Robot guardado a posición :", response);
      alert("El robot se guardo a su posición  exitosamente.");
      this.toggleSavePositionModal(); // Cierra el modal
    },
    error: (error) => {
      console.error("Error al guardar el robot a la posición :", error);
      alert("Ocurrió un error al guardar el robot.");
    }
  });
}


toggleExecutePositionModal(): void {
  // Corregir el nombre de la variable para mantener consistencia
  this.showExecutePositionModal = !this.showExecutePositionModal;
}

moveRobotToExecutePosition(movementId: number): void {
  if (!this.robotToken) {
    alert('Token del robot no encontrado.');
    return;
  }

  if (!movementId) {
    alert('ID de movimiento no especificado.');
    return;
  }

  this.adminService.moveToExecutePosition(movementId, this.robotToken).subscribe({
    next: (response) => {
      console.log("Movimiento del robot ejecutado exitosamente:", response);
      alert("El robot se movió a la posición indicada exitosamente.");
      this.toggleExecutePositionModal(); // Cierra el modal
    },
    error: (error) => {
      console.error("Error al ejecutar el movimiento del robot:", error);
      alert("Ocurrió un error al ejecutar el movimiento del robot.");
    }
  });
}



toggleRobotGetModal(): void {
  this.getRobotGetDetails();
  this.showRobotGetModal = !this.showRobotGetModal;
}



getRobotGetDetails(): void {
  this.adminService.getRobot().subscribe({
    next: (response) => {
      if (response && response.length > 0) {
        this.robots = response; // Almacenar todos los robots
        console.log('Detalles de los robots obtenidos:', this.robots);
      } else {
        console.warn('La respuesta no contiene datos de robots.');
        this.robots = []; // Vacía la lista si no hay datos
      }
    },
    error: (error) => {
      console.error('Error al obtener los datos de los robots:', error);
      alert('No se pudieron obtener los detalles de los robots.');
    }
  });
}








}
