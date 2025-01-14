import { Component,Input,EventEmitter, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogpageComponent, DialogConfig } from '../../../material/dialogpage/dialogpage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { variable } from '../../../variable';
import { CompanyModel, SelecteddataModel, UserModel } from 'src/app/models/datamodule.module';

@Component({
  selector: 'app-userdatapage',
  templateUrl: './userdatapage.component.html',
  styleUrls: ['./userdatapage.component.scss']
})
export class UserdatapageComponent implements OnInit {
  constructor( private modalService: NgbModal, public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar ) { }
  @Input() modal: any;
  @Input()  activeuser:  UserModel |undefined;
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  listcustomer : CompanyModel[]=[];
  editcustomer : CompanyModel=new CompanyModel();
  show =  { Spinner: true ,phone:"",edit:false,delete:false};
  listrole:SelecteddataModel[]=[];
  listcomp:SelecteddataModel[]=[];
  editdata:  UserModel = new UserModel();
  base64Image: string = this.va.icon.user;

  async ngOnInit() {

    if(this.activeuser){
      this.editdata = new UserModel(this.activeuser) ;
      this.validatePhoneNumber(this.editdata.phone);
      this.listcustomer = await this.getlistcompanyadmin(this.activeuser.id);
      this.show.delete =(this.listcustomer.filter(x=>x.id==x.id).length==0)
    }else{
      this.listcomp =await this.getlistcomp();
      this.listrole =await this.getlistrole();
    }
    // console.log("this.listcustomer : ",this.listcustomer);
    this.show.Spinner=false;
  }
  async addcompany(data:CompanyModel){
    this.show.Spinner=true;
    this.editcustomer = data;
    if(await this.saveupdateusercompany(1,data.id,this.editdata.id)){
      this.editcustomer.id =data.id;
      this.show.delete =(this.listcustomer.filter(x=>x.id==x.id).length==0)
    }
    this.show.Spinner=false;
  }
  async deletecompany(data:CompanyModel){
    this.show.Spinner=true;
    this.editcustomer = data;
    if(await this.saveupdateusercompany(-3,data.id,this.editdata.id)){
      this.editcustomer.id =0;
      this.show.delete =(this.listcustomer.filter(x=>x.id==x.id).length==0)
    }
    this.show.Spinner=false;
  }

  //===================================================================
  // #region  =========== Get list data ===============================
  async getlistcompanyadmin(id :number) {
    var result: CompanyModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'companyadmin',empid:id};
    var jsondata = await this.va.getwsdata(wsname, params);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new CompanyModel(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }
  async getlistrole() {
    var result: SelecteddataModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'listrole'};
    var jsondata = await this.va.getwsdata(wsname, params);
    // console.log("getlistrole jsondata : ", jsondata);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new SelecteddataModel(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }
  async getlistcomp() {
    var result: SelecteddataModel[] = [];
    var wsname = 'getdata';
    var params = { tbname: 'listcomp'};
    var jsondata = await this.va.getwsdata(wsname, params);
    if (jsondata.code == "000") {
      jsondata.data.forEach((data: any) => {
        var temp = new SelecteddataModel(data);
        result.push(temp);
      });
    } else {

    }
    return result;

  }


  
  // #endregion  =========== Get list data ============================
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
          this.editdata.userimage = base64;
          if(this.activeuser){this.activeuser.userimage =this.base64Image;}          
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
      var param = {tbname:"userimage",empid:this.activeuser?.id,image:image};
      // console.log("saveimage ",param)
      var jsondata = await this.va.getwsdata(wsname,param)
      if(jsondata.code=="000"){
        return true;
      }
    }catch(ex){
      // console.log("saveupdateplan Error : ",ex)
      this.showSanckbar("save or update  route error" + ex,2);
    }
    return false;
  }
  // #endregion  =========== Update Image =============================
  //===================================================================

  //===================================================================
  // #region  =========== Validate Data ===============================

  userdatachange(type:string){
    // console.log("type",type);
    if(this.activeuser){
      if(type=="prefix"){
        if(!this.show.edit){this.show.edit = (this.activeuser.prefix!=this.editdata.prefix);}
      }else if(type=="firstname"){
        if(!this.show.edit){this.show.edit = (this.activeuser.firstname!=this.editdata.firstname);}
      }else if(type=="surname"){
        if(!this.show.edit){this.show.edit = (this.activeuser.surename!=this.editdata.surename);}
      }else if(type=="remark"){
        if(!this.show.edit){this.show.edit = (this.activeuser.remark!=this.editdata.remark);}
      }else if(type=="empcode"){
        if(!this.show.edit){this.show.edit = (this.activeuser.empcode!=this.editdata.empcode);}
      }
      this.editdata.empname =this.editdata.prefix+" "+this.editdata.firstname+" "+this.editdata.surename;
    }else{
      if(type==="roleid"){
        // console.log("this.editdata.selectrole",this.editdata.selectrole);
        var role=this.listrole.find(x=>x.id==this.editdata.selectrole);
        // console.log("role",role);
        if(role){this.editdata.rolename=role.display;}    
      }else if(type=="compid"){
        var comp=this.listcomp.find(x=>x.id==this.editdata.selectcomp);
        if(comp){this.editdata.companyname=comp.display;}    
      }
    }
    // console.log("this.editdata ",this.editdata )
    // console.log("this.activeuser ",this.activeuser )
    // console.log("this.show.edit ",this.show.edit )
  }

  validatePhoneNumber(value: string) {
    if(value){
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
      // console.log("this.show.phone  :",this.show.phone ); 
  
      if(this.activeuser && !this.show.edit){this.show.edit = (this.activeuser.phone!=this.editdata.phone);}
          // Update the form control with the first 10 digits  
    }else{
      this.show.phone="";
      this.editdata.phone="";
    }
  }

  // #endregion  =========== Validate Data & QR Code ==================
  //===================================================================


  // ===== Message Dialog ====================


  //===================================================================

  // #region  =========== Save Update Delete ==========================
  validatedata(){
    var msg ="Please Fill in prefix"
    if(this.editdata.prefix.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in firstname"
    if(this.editdata.firstname.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in surname"
    if(this.editdata.surename.trim()==""){this.showSanckbar(msg); return false;}  
    msg ="Please Fill in phone"
    this.editdata.phone = this.editdata.phone.replace(/\D/g, '');
    if(this.editdata.phone.trim()==""|| this.editdata.phone.length<10){this.showSanckbar(msg); return;}  
    return true;
  }
  async saveuser(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการบันทึกข้อมูลผู้ใช้งานใหม่หรือไม่");
        if(confirm=="true"){
          if(await this.saveupdateuser(0)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลผู้ใช้งานใหม่เรียบร้อยแล้ว");
              this.talk.emit(this.activeuser);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลข้อมูลผู้ใช้งานใหม่ผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("saveuser error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async updateuser(){
    if(this.validatedata()){
      try{     
        var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการแก้ไขข้อมูลผู้ใช้งานหรือไม่");
        if(confirm=="true"){
          if(await this.saveupdateuser(1)){
              this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลผู้ใช้งานเรียบร้อยแล้ว");
              this.talk.emit(this.activeuser);
              this.modal.close();
          }else{
            this.alertMessage("แจ้งเตือน", "บันทึกข้อมูลการแก้ไขข้อมูลผู้ใช้งานผิดพลาดโปรดลองอีกครัง");
            this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง");
          }
        }
      }catch(ex){
        console.log("updateuser error ",ex)
        this.showSanckbar("บันทึกข้อมูล ผิดพลาดโปรดลองอีกครัง")
      }
  
    } 
  }
  async deleteuser(){
    try{     
      var confirm =await this.OkCancelMessage("ยืนยันการบันทึก","คุณต้องการลบข้อมูลผู้ใช้งานหรือไม่");
      if(confirm=="true"){
        if(await this.saveupdateuser(-3)){
          this.alertMessage("แจ้งเตือน", "ข้อมูลผู้ใช้งานถูกลบแล้ว")
          this.showSanckbar("ลบข้อมูลเรียบร้อยแล้ว");
            this.talk.emit(this.activeuser);
            this.modal.close();
        }else{
          this.alertMessage("แจ้งเตือน", "ลบข้อมูลผิดพลาดโปรดลองอีกครัง")
          this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง");
        }
      }
    }catch(ex){
      console.log("deleteuser error ",ex)
      this.showSanckbar("ลบข้อมูล ผิดพลาดโปรดลองอีกครัง")
    }
  }
  async saveupdateuser(status:number){
    try{
      var tbname =((status==0)?"newuser":"user");
      var wsname = ((status<0)?"deldata":"updatedata");
      if(status<1){this.editdata.transtatus = status;}
      // console.log("saveupdateuser this.editdata : ",this.editdata);
      var jsondata = await this.va.getwsdata(wsname,{tbname:tbname,data:this.editdata})
      if(jsondata.code=="000"){       
        if(status<0){this.activeuser=undefined;}
        else{ 
          this.editdata.empname=(this.editdata.prefix+' '+this.editdata.firstname+' '+this.editdata.surename) ;
          this.activeuser=this.editdata;
        }
        return true;
      }
    }catch(ex){
      console.log("saveupdateuser Error : ",ex);
      this.showSanckbar("save or updatedriver error" + ex,2);
    }
    this.editdata.transtatus =(this.activeuser?this.activeuser.transtatus:0) ;
    return false;
  }
  async saveupdateusercompany(status:number,compid:number,userid:number){
    try{
      var wsname = ((status<0)?"deldata":"updatedata");
      if(status<1){this.editdata.transtatus = status;}
      var jsondata = await this.va.getwsdata(wsname,{tbname:"usercomp",compid:compid,userid:userid})
      var msg = (status<0)?"Delete ":"Save ";
      if(jsondata.code=="000"){
        this.showSanckbar(msg +"User in Company Success");
        return true;
      }else { this.showSanckbar(msg +"User in Company Failed"); }
    }catch(ex){
      console.log("saveupdateusercompany Error : ",ex);
      this.showSanckbar("save or updatedriver error" + ex,2);
    }
    return false;
  }

  // #endregion  =========== Save Update Delete ==========================
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
      // dialogRef.afterClosed().subscribe(result => {
      //   return result;
      // });
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
