import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { DriverdataModel, Selecteddata, VehicleModel } from 'src/app/models/datamodule.module';
import { variable } from '../../../variable';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-vehiclepage',
  templateUrl: './vehiclepage.component.html',
  styleUrls: ['./vehiclepage.component.scss']
})

export class VehiclepageComponent {
  constructor(public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar) { }

  @Input() modal: any;
  @Input() editdata: VehicleModel =new VehicleModel() ;
  @Input() vehicledata: VehicleModel |undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();

  // public Qrdata:string = JSON.stringify({empname:"thavon",surname:"seesai",phone:"093368131"});
  show = { Spinner: false, edit: false ,phone:"",editdriver:false,editgps:false,keyword:""};
  public Qrdata: string = "";
  base64Image: string = this.va.icon.user;
  listprovince:Selecteddata[]=[];
  listvtype:Selecteddata[]=[];
  listgps:Selecteddata[]=[];
  gpsfilter:Selecteddata[]=[];
  listdriver:DriverdataModel[]=[];
  selecteddriver:DriverdataModel =new DriverdataModel();
  selectedgps:Selecteddata =new Selecteddata();

  async ngOnInit() {
    try{
      // console.log("this.vehicledata : ",this.vehicledata);
      if(this.vehicledata) {
        this.editdata = new VehicleModel(this.vehicledata) ;
        this.listdriver = await this.getlistdriver();
        this.show.editdriver=this.editdata.driverid==0;
      }
      this.listprovince = await this.getlistprovince();
      this.listvtype = await this.getlistvtype();
      // console.log("this.viewData :",this.editdata);
    }catch(ex){ console.log("ngOnInit Error :",ex);}
  }

  //===================================================================
  // #region  =========== Get list data ===============================
  async getlistdriver() {
    var result: DriverdataModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'driver',unvehicle:true,limit:0};
    var jsondata = await this.va.getwsdata(wsname, params);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new DriverdataModel(data);
        result.push(temp);
      });
    } 
    else { this.showSanckbar("get list of Driver Failure");}
    return result;
  }
  async getlistvtype() {
    var result: Selecteddata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'listvtype'};
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getlistrole jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Selecteddata(data);
        result.push(temp);
      });
    } 
    else { this.showSanckbar("get list of Vehicle type Failure");}
    return result;

  }
  async getlistprovince() {
    var result: Selecteddata[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'listprovince'};
    var jsondata = await this.va.getwsdata(wsname, params);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new Selecteddata(data);
        result.push(temp);
      });
    } 
    else { this.showSanckbar("get list of Province Failure");}
    return result;

  }
  async getlistgps() {
    var result: Selecteddata[] = [];
    var wsname = 'getgpsvehicle';
    var params = { tbname: 'listgps'};
    var jsondata = await this.va.getwsdata(wsname, params);
    if (jsondata.code == "000") {
      var i:number =1;
      jsondata.data.forEach((data: any) => {
        var gps={id:i,display:data.vname,ref1:data.serialbox,ref2:data.vlicense,ref3:data.adminname,ref4:(data.lat+','+data.lng)}
        var temp = new Selecteddata(gps);
        result.push(temp);
        i++
      });
      // console.log("getlistgps result : ", result);

    } 
    else { this.showSanckbar("get list of GPS Failure");}
    return result;

  }


  
  // #endregion  =========== Get list data ============================
  //===================================================================

  //===================================================================
  // #region  =========== Driver data =================================
  driverchange(id:number){
    var driver = this.listdriver.find(x=>x.id==id);
    if(driver){this.selecteddriver = driver;}
    else{this.selecteddriver = new DriverdataModel();}
  }
  editdriver(status:boolean){
    this.show.editdriver=status;
  }
  async updatedriver(){
    if(this.selecteddriver.id!=0){
      if(await this.savedriverinvehicle()){
        this.editdata.driverid=this.selecteddriver.id;
        this.editdata.fullname=this.selecteddriver.fullname;
        this.editdata.drivername=this.selecteddriver.empname;
        this.editdata.driversurname=this.selecteddriver.surname;
        this.editdata.driverphone=this.selecteddriver.phone;
        this.editdata.driverimage=this.selecteddriver.driverimg;
        this.vehicledata =this.editdata;
        this.show.editdriver=false;
        this.talk.emit(this.vehicledata);
        this.modal.close();
        this.showSanckbar("Update driver success");
      }else{
        this.showSanckbar("Update driver error");
      }
    }
  }
  async deletedriver(){
    this.selecteddriver= new DriverdataModel();
    if(await this.savedriverinvehicle()){
      this.editdata.driverid=this.selecteddriver.id;
      this.editdata.fullname=this.selecteddriver.fullname;
      this.editdata.drivername=this.selecteddriver.empname;
      this.editdata.driversurname=this.selecteddriver.surname;
      this.editdata.driverphone=this.selecteddriver.phone;
      this.editdata.driverimage=this.selecteddriver.driverimg;
      this.vehicledata =this.editdata;
      this.show.editdriver=false;
      this.talk.emit(this.vehicledata);
      this.modal.close();
this.showSanckbar("Update driver success");
    }else{
      this.showSanckbar("Update driver error");
    }
  }
  async savedriverinvehicle(){
    try{
      var tbname = "driverinvehicle" ;
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,vid:this.editdata.vid,driverid:this.selecteddriver.id});
      if(jsondata.code=="000"){ return true;}
    }catch(ex){
      console.log("savedriverinvehicle Error : ",ex);
      this.showSanckbar("save or update vehicle error" + ex,2);
    }
    this.editdata.transtatus =(this.vehicledata?this.vehicledata.transtatus:0) ;
    return false;
  }
  // #endregion  =========== Driver data ==============================
  //===================================================================

  //===================================================================
  // #region  =========== GPS data ====================================
  async editgps(){
    this.show.editgps = true;
    if(this.listgps.length==0){
      this.show.Spinner=true;
      this.listgps = await this.getlistgps();
      this.gpsfilter = this.listgps.slice(0, 20);
      if(this.gpsfilter.length>0){this.selectedgps=this.gpsfilter[0];}
      this.show.Spinner=false;
    }
  }
  searchgps(){
    var keyword =this.show.keyword;
    this.gpsfilter = this.listgps.filter(x=>x.display.includes(keyword)||x.ref2.includes(keyword)).slice(0, 20);
    if(this.gpsfilter.length>0){this.selectedgps=this.gpsfilter[0];}
  }
  selecteddata(data:Selecteddata){
    this.selectedgps =data;
  }
  async savegps(){
    this.show.Spinner=true;
    if(await this.savegpsinvehicle()){
      this.editdata.serialbox=this.selectedgps.ref1;
      this.vehicledata =this.editdata;
      this.show.editgps=false;
      this.talk.emit(this.vehicledata);
      this.modal.close();
      this.showSanckbar("Update GPS success");
    }else{
      this.showSanckbar("Update GPS error");
    }    
    this.show.Spinner=false;
  }

  async deletegps(){
    this.show.Spinner=true;
    this.selectedgps.ref1="";
    if(await this.savegpsinvehicle()){
      this.editdata.serialbox=this.selectedgps.ref1;
      this.vehicledata =this.editdata;
      this.show.editgps=false;
      this.talk.emit(this.vehicledata);
      this.modal.close();
      this.showSanckbar("Delete GPS success");
    }else{
      this.showSanckbar("Delete GPS error");
    }    
    this.show.Spinner=false;

  }

  async savegpsinvehicle(){
    try{
      var tbname = "gpsinvehicle" ;
      var wsname = "updatedata";
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,vid:this.editdata.vid,gps:this.selectedgps.ref1});
      if(jsondata.code=="000"){ return true;}
    }catch(ex){
      console.log("savegpsinvehicle Error : ",ex);
      this.showSanckbar("save or update gps error" + ex,2);
    }
    this.editdata.transtatus =(this.vehicledata?this.vehicledata.transtatus:0) ;
    return false;
  }


  cancelgps(){this.show.editgps = false;}


  // #endregion  =========== GPS data =================================
  //===================================================================


  //===================================================================
  // #region  =========== Validate Data & QR Code =====================

  vehicledatachange(type:string){
    // console.log("type : ",type);
    if(type=="licent1"){
      if(this.editdata.licent1.length>3){this.editdata.licent1=this.editdata.licent1.substring(0, 3); }
      this.editdata.vlicent =(this.editdata.licent1+"-"+this.editdata.licent2);
    }
    else if(type=="licent2"){
      this.editdata.licent2 = this.editdata.licent2.replace(/\D/g, '');
      if(this.editdata.licent2.length>4){this.editdata.licent2=this.editdata.licent2.substring(0, 4); }
      this.editdata.vlicent =(this.editdata.licent1+"-"+this.editdata.licent2);
    }
    else if(type=="province"){
      var province = this.listprovince.find(x=>x.id==this.editdata.provinceid);
      if(province){
        this.editdata.province=province.display;
        this.editdata.provincecode=province.ref1;
      }

    }
    else if(type=="vtype"){
      var vtype = this.listvtype.find(x=>x.id==this.editdata.vtype);
      if(vtype){this.editdata.typename=vtype.display;}
    }

    if(this.vehicledata){
      if(type=="licent1"){
        if(!this.show.edit){ this.show.edit = (this.vehicledata.vlicent!=this.editdata.vlicent); }
      }else if(type=="licent2"){
        if(!this.show.edit){ this.show.edit = (this.vehicledata.vlicent!=this.editdata.vlicent); }
      }else if(type=="province"){
        if(!this.show.edit){ this.show.edit = (this.vehicledata.provinceid!=this.editdata.provinceid); }
      }else if(type=="vtype"){
        if(!this.show.edit){ this.show.edit = (this.vehicledata.vtype!=this.editdata.vtype); }
      }
    }
    // console.log("this.show.edit ",this.show.edit )
  }

  // #endregion  =========== Validate Data & QR Code ==================
  //===================================================================

  //===================================================================
  // #region  =========== Save Update Delete ==========================
  validatedata(){
    var msg ="Please Fill in Vehicle First position of License"
    if(this.editdata.licent1.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in Vehicle Last position of License"
    if(this.editdata.licent2.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in Province of License"
    if(this.editdata.province.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in Vehicle type"
    if(this.editdata.typename.trim()==""){this.showSanckbar(msg); return false;}  
    return true;
  }
  async savevehicle(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลรถใหม่หรือไม่");
        if(confirm=="true"){
          if(await this.saveupdatevehicle(0)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลรถใหม่เรียบร้อยแล้ว");
              this.talk.emit(this.vehicledata);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลรถใหม่ผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("savevehicle error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async updatevehicle(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการแก้ไขข้อมูลรถหรือไม่");
        if(confirm=="true"){
          if(await this.saveupdatevehicle(1)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลรถเรียบร้อยแล้ว");
              this.talk.emit(this.vehicledata);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลรถผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("updatevehicle error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async deletevehicle(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการลบข้อมูลพนักงานขับรถหรือไม่");
      if(confirm=="true"){
        if(await this.saveupdatevehicle(-3)){
          this.alertMessage("แจ้งเตือน", "ข้อมูลพนักงานขับรถถูกลบแล้ว")
          this.showSanckbar("ลบข้อมูลเรียบร้อยแล้ว");
            this.talk.emit(undefined);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลผิดพลาดโปรดลองอีกครัง")
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("deletevehicle error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }
  async saveupdatevehicle(status:number){
    try{
      var tbname =((status==0)?"newvehicle":"vehicle");
      var wsname = ((status<0)?"deldata":"updatedata");
      if(status<1){this.editdata.transtatus = status;}
      // console.log("saveupdatevehicle this.editdata : ",this.editdata);
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.editdata})
      if(jsondata.code=="000"){       
        if(status<0){this.vehicledata=undefined;}
        else{ this.vehicledata=this.editdata;}
        return true;
      }
    }catch(ex){
      console.log("saveupdatevehicle Error : ",ex);
      this.showSanckbar("save or update vehicle error" + ex,2);
    }
    this.editdata.transtatus =(this.vehicledata?this.vehicledata.transtatus:0) ;
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
          if(this.vehicledata){this.vehicledata.driverimage =this.base64Image;}          
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
      // console.log(this.base64Image); // You can now send this Base64 string to your backend for storage
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

        // console.log(this.base64Image); // Base64 string for the resized image
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
      var param = {tbname:"driverimage",driverid:this.vehicledata?.vid,image:image};
      // console.log("saveimage ",param)
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        return true;
      }
    }catch(ex){
      console.log("saveimage Error : ",ex)
      this.showSanckbar("save or update  image error" + ex,2);
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