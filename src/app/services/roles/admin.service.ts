import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "https://humansyncbackend.onrender.com/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private http: HttpClient, private userStorageService: UserStorageService
    // Inyecta el servicio para acceder al token
  ) {}



  // Método para crear un robot
// Método para crear un robot
createRobot(request: { botname: string; initial_position: number[]; current_position: number[] }): Observable<any> {
  const headers = this.createAuthorizationHeader();

  return this.http.post(BASIC_URL + "api/v1/robot/create", request, { headers })
    .pipe(
      // Usa tap para realizar acciones adicionales sin alterar el flujo
      tap((response: any) => {
        console.log("Robot creado exitosamente:", response);
        const robotToken = response.token; // Ajusta esto según la estructura real de la respuesta
        console.log("Token del robot:", robotToken);

        // Guarda el token en localStorage (u otra estrategia de almacenamiento)
        localStorage.setItem('robotToken', robotToken);
      }),
      catchError(error => {
        console.error("Error en la creación del robot:", error); // Manejo de errores
        return throwError(error);
      })
    );
}


getRobotByToken(robotToken: string): Observable<any> {
  const headers = this.createAuthorizationHeader();

  return this.http.get(`${BASIC_URL}api/v1/robot/by-token/${robotToken}`, { headers })
    .pipe(
      tap(response => {
        console.log("Datos del robot obtenidos exitosamente:", response);
      }),
      catchError(error => {
        console.error("Error al obtener los datos del robot:", error);
        return throwError(error);
      })
    );
}

moveToInitialPosition(robotToken: string): Observable<any> {
  const headers = this.createAuthorizationHeader();

  return this.http.post(`${BASIC_URL}api/v1/robot/move-initial-position/${robotToken}`, {}, { headers })
    .pipe(
      tap((response) => {
        console.log("El robot se movió a la posición inicial exitosamente:", response);
      }),
      catchError((error) => {
        console.error("Error al mover el robot a la posición inicial:", error);
        return throwError(error);
      })
    );
}

moveToCurrentPosition(robotToken: string): Observable<any> {
  const headers = this.createAuthorizationHeader();

  return this.http.post(`${BASIC_URL}api/v1/robot/move-current-position/${robotToken}`, {}, { headers })
    .pipe(
      tap((response) => {
        console.log("El robot se movió  exitosamente:", response);
      }),
      catchError((error) => {
        console.error("Error al mover el robot a la posición :", error);
        return throwError(error);
      })
    );
}


moveToSavePosition(robotToken: string): Observable<any> {
  const headers = this.createAuthorizationHeader();

  return this.http.post(`${BASIC_URL}api/v1/robot/save-data-locally/${robotToken}`, {}, { headers })
    .pipe(
      tap((response) => {
        console.log("El robot se guardo exitosamente:", response);
      }),
      catchError((error) => {
        console.error("Error al guardar el robot a la posición :", error);
        return throwError(error);
      })
    );
}



moveToExecutePosition(movementId: number, robotToken: string): Observable<any> {
  const headers = this.createAuthorizationHeader();

  // Asegurar que la URL esté correctamente formada
  const url = `${BASIC_URL}/api/v1/robot/execute-movement/${movementId}/${robotToken}`;

  return this.http.post(url, {}, { headers }).pipe(
    tap((response) => {
      console.log("Movimiento ejecutado exitosamente:", response);
    }),
    catchError((error) => {
      console.error("Error al ejecutar el movimiento del robot:", error);
      return throwError(() => new Error('Error al ejecutar el movimiento'));
    })
  );
}






createMovement(request: { name: string; robot_id: number }): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.post(BASIC_URL + "api/v1/movement/create", request, { headers })
    .pipe(
      catchError(error => {
        console.error("Error en la creación del movimiento:", error);
        return throwError(error);
      })
    );
}


createDelayAngles(request: { delay: number; angles: number[]; movement_id: number }): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.post(BASIC_URL + "api/v1/position/create", request, { headers })
    .pipe(
      catchError(error => {
        console.error("Error en la creación del delay y ángulos:", error);
        return throwError(error);
      })
    );
}



getMovementsByRobotId(robotId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.get(`${BASIC_URL}api/v1/movement/all-by-robot/${robotId}`, { headers })
  .pipe(
    catchError(error => {
      console.error("Error en obtener los movimientos:", error);
      return throwError(error);
    })
  );
}


updateMovement(movementId: number, request: { name: string }): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.put(`${BASIC_URL}api/v1/movement/update/${movementId}`, request, { headers })
    .pipe(
      catchError(error => {
        console.error("Error detallado:", {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(error);
      })
    );
}


deleteMovement(movementId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.delete(`${BASIC_URL}api/v1/movement/delete/${movementId}`, { headers })
    .pipe(
      catchError(error => {
        console.error("Error al eliminar el movimiento:", error);
        return throwError(error);
      })
    );
}



getMovementsByPositionId(movementId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.get(`${BASIC_URL}api/v1/position/all-by-movement/${movementId}`, { headers })
  .pipe(
    catchError(error => {
      console.error("Error en obtener los movimientos:", error);
      return throwError(error);
    })
  );
}


updatePosition(positionId: number, request: { delay: number; angles: number[] }): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.put(`${BASIC_URL}api/v1/position/update/${positionId}`, request, { headers })
    .pipe(
      catchError(error => {
        console.error("Error al actualizar la posición:", error);
        return throwError(error);
      })
    );
}


updatePositionIncrease(positionId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  // El error está aquí - la sintaxis de la petición es incorrecta
  return this.http.put(`${BASIC_URL}api/v1/position/increase/${positionId}`, {}, { headers })
    .pipe(
      catchError(error => {
        console.error("Error en incrementar la posición:", error);
        return throwError(error);
      })
    );
}

updatePositionDecrease(positionId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.put(`${BASIC_URL}api/v1/position/decrease/${positionId}`, {}, { headers })
    .pipe(
      catchError(error => {
        console.error("Errore al decrementar la posición:", error);
        return throwError(error);
      })
    );
}





deletePosition(positionId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.delete(`${BASIC_URL}api/v1/position/delete/${positionId}`, { headers })
    .pipe(
      catchError(error => {
        console.error("Error al eliminar la posicion:", error);
        return throwError(error);
      })
    );
}


getRobot(): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.get(`${BASIC_URL}api/v1/robot/all-with-token`, { headers })
  .pipe(
    catchError(error => {
      console.error("Error en obtener los movimientos:", error);
      return throwError(error);
    })
  );
}



















    // Método para crear el encabezado de autorización
    private createAuthorizationHeader(): HttpHeaders {
      return new HttpHeaders().set(
        'Authorization', 'Bearer ' + this.userStorageService.getToken()

      )
    }

  // Otros métodos del servicio...
}
