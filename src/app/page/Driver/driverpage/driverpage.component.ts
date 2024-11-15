import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { Driverdata } from 'src/app/models/datamodule.module';
import { variable } from '../../../variable';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-driverpage',
  templateUrl: './driverpage.component.html',
  styleUrls: ['./driverpage.component.scss']
})
export class DriverpageComponent {
  constructor(public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar) { }

  @Input() modal: any;
  @Input() viewData: any;
  @Input() driverData: Driverdata |undefined;
  @Output() repage: EventEmitter<any> = new EventEmitter<any>();

  // public Qrdata:string = JSON.stringify({empname:"thavon",surname:"seesai",phone:"093368131"});
  public Qrdata: string = "";
  base64Image: string = this.va.icon.user;

  ngOnInit(): void {
    console.log("this.driverData : ",this.driverData);
    if (this.viewData) {
      this.Qrdata = JSON.stringify({ empname: this.viewData.drivername, surname: this.viewData.surname, phone: this.viewData.phone });
    }
    else {
      this.Qrdata = JSON.stringify({ empname: this.driverData?.empname, surname: this.driverData?.surname, phone: this.driverData?.phone });
      this.viewData = {
        lineimage : this.driverData?.driverimg,
        driverfullname: this.driverData?.fullname,
        drivername: this.driverData?.empname,
        surname: this.driverData?.surname,
        nickname: this.driverData?.empname,
        license: this.driverData?.licent,
        licensetype: "",
        phone: this.driverData?.phone,
        mobile: this.driverData?.phone,
        linename: this.driverData?.linename,
      }
    }
    console.log("viewdata 2: ", this.viewData);
  }

  async  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await this.resizeImage(file); 
        if(await this.saveimage(base64)){
          this.base64Image = base64;
          if(this.driverData){this.driverData.driverimg =this.base64Image;}          
        }
      } catch (error) {
        console.error('Error handling image:', error);
      }
    }
    
  }
  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.base64Image = reader.result as string;
      console.log(this.base64Image); // You can now send this Base64 string to your backend for storage
    };

    reader.onerror = (error) => {
      console.error('Error converting file to Base64:', error);
    };
  }
  resizeImage(file: File): Promise<string>  {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            
            // Set canvas size to 256x256
            const canvasSize = 256;
            canvas.width = canvasSize;
            canvas.height = canvasSize;

            // Original image size: 512x600
            const originalWidth = img.width;
            const originalHeight = img.height;
            // Calculate the aspect ratio of the original image
            const aspectRatio = originalWidth / originalHeight;
            // console.log (originalWidth+","+originalHeight + " : ", aspectRatio )
            // Calculate the new width and height while maintaining the aspect ratio
            let newWidth = canvasSize;
            let newHeight = canvasSize;
            // Define the offset (start position for drawing the image)
            let offsetX = 0; // Start from the left (0)
            let offsetY = 0; // Start 22 pixels from the top

            if (originalWidth < originalHeight) {
              newHeight = canvasSize / aspectRatio; // Scale height to fit aspect ratio
              if(originalHeight>newHeight){offsetY = (0-((newHeight-256)/2));}
              else{offsetY = 0;}
              // else{offsetY = ((newHeight-256)/2);}
              
              // newHeight = canvasSize * aspectRatio; // Scale height to fit aspect ratio
            } else {
              newWidth = canvasSize * aspectRatio; // Scale width to fit aspect ratio
              if(originalWidth>newWidth){offsetX = (0-((newWidth-256)/2));}
              else{offsetX = 0}
              // else{offsetX = (newWidth-256)}
              // newWidth = canvasSize / aspectRatio; // Scale width to fit aspect ratio
            }

            // Set the canvas size to the new calculated dimensions
            canvas.width = canvasSize;
            canvas.height = canvasSize;

            // console.log (offsetX,offsetY)
            // console.log (newWidth ,newHeight)

            // Draw the resized image onto the canvas at the offset position
            ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
            // ctx.drawImage(img, offsetX, offsetY, 256, 256);

            // Convert the canvas content to Base64 string
            resolve(canvas.toDataURL(file.type));
          }catch(error) {
            reject('Error resizing image: ' + error);
          }
        };
        img.onerror = (err) => {
          reject('Error loading image: ' + err);
        };

        img.src = e.target.result;
      };
      reader.onerror = (err) => {
        reject('Error reading file: ' + err);
      };
      reader.readAsDataURL(file);
    });
  }

  resizeImagesameratiosmall(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas size to 256x256
        const canvasSize = 256;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Calculate the aspect ratio
        const aspectRatio = img.width / img.height;

        // Calculate new width and height while preserving the aspect ratio
        let newWidth = canvasSize;
        let newHeight = canvasSize;

        if (img.width > img.height) {
          newHeight = canvasSize / aspectRatio; // Scale height to fit aspect ratio
        } else {
          newWidth = canvasSize * aspectRatio; // Scale width to fit aspect ratio
        }

        // Calculate offsets to center the image
        const offsetX = (canvasSize - newWidth) / 2;
        const offsetY = (canvasSize - newHeight) / 2;

        // Set the canvas size to the calculated new dimensions
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Draw the resized and centered image onto the canvas
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        // Convert the canvas content to Base64 string
        this.base64Image = canvas.toDataURL(file.type);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  resizeImagestrange (file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas element to draw the resized image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas dimensions to 256x256
        canvas.width = 256;
        canvas.height = 256;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, 256, 256);
        
        // Convert the canvas content to Base64 string
        this.base64Image = canvas.toDataURL(file.type); // file.type will keep the original image format (JPEG, PNG, etc.)

        console.log(this.base64Image); // Base64 string for the resized image
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file); // Read the selected image file
  }
  resizeImagesameratiobig(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Calculate new dimensions while preserving the aspect ratio
        let newWidth = 256;
        let newHeight = 256;

        if (img.width > img.height) {
          // Landscape orientation: Scale width to 256, height adjusts accordingly
          newHeight = 256 / aspectRatio;
        } else {
          // Portrait orientation: Scale height to 256, width adjusts accordingly
          newWidth = 256 * aspectRatio;
        }

        // Set the canvas size
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw the image on the canvas with the new dimensions
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert the canvas content to Base64 string
        this.base64Image = canvas.toDataURL(file.type);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  async saveimage(image: string){
    try{
      var wsname = "saveimage";
      var param = {tbname:"driverimage",driverid:this.driverData?.id,image:image};
      console.log("saveimage ",param)
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        return true;
      }
    }catch(ex){
      console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("save or update  route error" + ex,2);
    }
    return false;
  }

  // ===== Message Dialog ====================

  alertMessage(header: string, message: string) {
    var dialogRef = this.dialog.open(DialogpageComponent,
      { data: new DialogConfig(header, message, false) }
    );
    dialogRef.afterClosed().subscribe(result => {
      // console.log("Dialog result : ",result);
    });
  }

  OkCancelMessage(header: string, message: string): Promise<any>{
    try{
      var dialogRef = this.dialog.open(DialogpageComponent,
        { data: new DialogConfig(header, message, true) }
      );
      return dialogRef.afterClosed().toPromise();
      }catch(ex){
        console.log("OkCancelMessage error ",ex)
        return Promise.reject(ex); // If there's an error, reject the promise
      }
  }

  showSanckbar(message: string, duration = 5) {
    this.snacbar.open(message, 'Close',
      { duration: (duration * 1000), horizontalPosition: 'center', verticalPosition: 'bottom' });
  }

}
