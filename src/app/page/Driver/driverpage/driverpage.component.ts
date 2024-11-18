import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { DriverdataModel } from 'src/app/models/datamodule.module';
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
  @Input() editdata: DriverdataModel =new DriverdataModel() ;
  @Input() driverdata: DriverdataModel |undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  // public Qrdata:string = JSON.stringify({empname:"thavon",surname:"seesai",phone:"093368131"});
  show = { Spinner: false, edit: false ,phone:"" };
  public Qrdata: string = "";
  base64Image: string = this.va.icon.user;

  ngOnInit(): void {
    try{
      // console.log("this.driverdata : ",this.driverdata);
      if(this.driverdata) {
        this.editdata = new DriverdataModel(this.driverdata) ;
        this.validatePhoneNumber(this.editdata.phone);
        this.craeteqrcode()
      }
      console.log("this.viewData :",this.editdata);
    }catch(ex){ console.log("ngOnInit Error :",ex);}
  }

  //===================================================================
  // #region  =========== Validate Data & QR Code =====================
  craeteqrcode(){
    if(this.driverdata){
      this.Qrdata = JSON.stringify(
        { empname: this.driverdata.empname, 
          surname: this.driverdata.surname, 
          phone: this.driverdata.phone 
        });
    }
  }

  driverdatachange(type:string){
    if(this.driverdata){
      if(type=="prefix"){
        if(!this.show.edit){this.show.edit = (this.driverdata.prefix!=this.editdata.prefix);}
      }else if(type=="empname"){
        if(!this.show.edit){this.show.edit = (this.driverdata.empname!=this.editdata.empname);}
      }else if(type=="surname"){
        if(!this.show.edit){this.show.edit = (this.driverdata.surname!=this.editdata.surname);}
      }else if(type=="remark"){
        if(!this.show.edit){this.show.edit = (this.driverdata.remark!=this.editdata.remark);}
      }else if(type=="licent"){
        if(!this.show.edit){this.show.edit = (this.driverdata.licent!=this.editdata.licent);}
      }
      this.editdata.fullname =this.editdata.prefix+" "+this.editdata.empname+" "+this.editdata.surname;
    }
    console.log("this.show.edit ",this.show.edit )
  }

  validatePhoneNumber(value: string) {
    // Remove non-digit characters
    let formattedValue = value.replace(/\D/g, '');
    // Format as phone number (e.g., (123) 456-7890)
    if (formattedValue.length > 6) {
      formattedValue = formattedValue.replace(
        /(\d{3})(\d{3})(\d{4})/,
        '($1) $2-$3'
      );
    } else if (formattedValue.length > 3) {
      formattedValue = formattedValue.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else {
      formattedValue = formattedValue.replace(/(\d{3})/, '($1)');
    }
    this.show.phone = formattedValue
    // console.log("formattedValue :",formattedValue);
    this.editdata.phone = formattedValue.replace(/\D/g, '');
    // console.log("this.editdata.phone :",this.editdata.phone); 
    console.log("this.show.phone  :",this.show.phone ); 

    if(this.driverdata && !this.show.edit){this.show.edit = (this.driverdata.phone!=this.editdata.phone);}
        // Update the form control with the first 10 digits
  }

  // #endregion  =========== Validate Data & QR Code ==================
  //===================================================================

  //===================================================================
  // #region  =========== Save Update Delete ==========================
  validatedata(){
    var msg ="Please Fill in prefix"
    if(this.editdata.prefix.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in empname"
    if(this.editdata.empname.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in surname"
    if(this.editdata.surname.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in phone"
    this.editdata.phone = this.editdata.phone.replace(/\D/g, '');
    if(this.editdata.phone.trim()==""|| this.editdata.phone.length<10){this.showSanckbar(msg); return;}  
    return true;
  }
  async savedriver(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลพนักงานขับรถใหม่หรือไม่");
        if(confirm=="true"){
          if(await this.saveupdatedriver(0)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลพนักงานใหม่เรียบร้อยแล้ว");
              this.talk.emit(this.driverdata);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลพนักงานใหม่ผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("save plan error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async updatedriver(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการแก้ไขข้อมูลพนักงานขับรถหรือไม่");
        if(confirm=="true"){
          if(await this.saveupdatedriver(1)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลพนักงานเรียบร้อยแล้ว");
              this.talk.emit(this.driverdata);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลพนักงานผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("save plan error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async deletedriver(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการลบข้อมูลพนักงานขับรถหรือไม่");
      if(confirm=="true"){
        if(await this.saveupdatedriver(-3)){
          this.alertMessage("แจ้งเตือน", "ข้อมูลพนักงานขับรถถูกลบแล้ว")
          this.showSanckbar("ลบข้อมูลเรียบร้อยแล้ว");
            this.talk.emit(this.driverdata);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลผิดพลาดโปรดลองอีกครัง")
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("save plan error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }

  async saveupdatedriver(status:number){
    try{
      var tbname =((status==0)?"newdriver":"driver");
      var wsname = ((status<0)?"deldata":"updatedata");
      if(status<1){this.editdata.transtatus = status;}
      console.log("saveupdatedriver this.editdata : ",this.editdata);
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.editdata})
      if(jsondata.code=="000"){       
        if(status<0){this.driverdata=undefined;}
        else{ this.driverdata=this.editdata;}
        return true;
      }
    }catch(ex){
      console.log("saveupdatedriver Error : ",ex);
      this.showSanckbar("save or updatedriver error" + ex,2);
    }
    this.editdata.transtatus =(this.driverdata?this.driverdata.transtatus:0) ;
    return false;
  }
  // #endregion  =========== Save Update Delete ==========================
  //===================================================================

  //===================================================================
  // #region  =========== Update Image ==============================

  async  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64 = await this.resizeImage(file); 
        if(await this.saveimage(base64)){
          this.base64Image = base64;
          if(this.driverdata){this.driverdata.driverimg =this.base64Image;}          
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
      var param = {tbname:"driverimage",driverid:this.driverdata?.id,image:image};
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
  // #endregion  =========== Update Image =============================
  //===================================================================


  //===================================================================
  // #region  =========== Message Dialog ==============================

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
  // #endregion  =========== Message Dialog ===========================
  //===================================================================

}
