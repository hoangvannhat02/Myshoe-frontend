import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from 'src/app/toast.service';
import { map, timestamp } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  messages$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  chats$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  @ViewChild('messageLink') messageLink!: ElementRef;

  dataMessages: any[] = [];

  datachatsid: any

  customer: any;

  content: string = ""

  quantityResend:number = 0

  orther:any = {}

  constructor(
    private db: AngularFireDatabase,
    private msgtoast: ToastService,
    private http:HttpClient
  ) {
    this.customer = JSON.parse(localStorage.getItem("customer") || '{}');
  }

  ngOnInit(): void {
    this.getDataOrther()
    setTimeout(() => {
      this.messageLink.nativeElement.style.display = 'block';
    }, 900);

    this.db.object('chats').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((chats: any[]) => {
      this.chats$.next(chats);
      console.log(this.chats$.value);
      
    });

    this.db.object('users').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((users: any[]) => {
      this.users$.next(users);      
    });

    this.db.object('messages').valueChanges().pipe(
      map((value: any) => {
        return value ? Object.entries(value).map(([key, value]) => ({ [key]: value })) : [];
      })
    ).subscribe((messages: any[]) => {
      this.messages$.next(messages);
      this.getQuantityResend()
    });
  }

  getDataOrther(){
    this.http.get("http://localhost:8000/admin/orther/getdata").subscribe((response) => {
      if (response) {
        this.orther = response

      }
    }, (error) => {
      console.error(error);
    }
    )
  }

  addData() {
    const data = {
      userid: '1',
      username: 'Jack parow2',
      avatar: 'https://example.com/avatar23.jpg'
    };
    this.db.list('users').push(data);
  }

  addChats() {
    const chatData = {
      chatId: "",
      roomname: '',
      members: [],
      lastMessage: {
        "messageId": "",
        "senderId": "",
        "content": "",
        "timestamp": ""
      }
    };

    this.db.list('chats').push(chatData);
  }

  addMessage() {
    const currentTimestamp = new Date().getTime();
    if (this.content.length < 1) {
      this.msgtoast.showToast({
        title: "Chưa nhập nội dung bình luận",
        type: 'warning'
      })
    }
    else {
      const msgData = {
        groupId: this.datachatsid,
        senderId: "customer" + this.customer.MaKhachHang,
        content: this.content,
        isreaduser: true,
        isreadadmin: false,
        timestamp: currentTimestamp
      }

      this.db.list('messages').push(msgData).then(() => {
        this.processData()
        const transformedData = this.messages$.value.map(obj => {
          const id = Object.keys(obj)[0];
          const data = obj[id];
          return { id, ...data };
        });
        const newData = {
          lastMessage: {
            content: transformedData[transformedData.length-1].content,
            messageId: transformedData[transformedData.length-1].id,
            senderId: transformedData[transformedData.length-1].senderId,
            timestamp: transformedData[transformedData.length-1].timestamp
          }
        }

        this.db.object('chats/' + this.datachatsid).update(newData)

        this.content = "";
        this.scrollEnd();
      })
        .catch(error => {
          console.error("Thêm dữ liệu không thành công:", error);
        });
    }
  }

  processData() {
    let user: any[] = []
    this.messages$.pipe(
      map((messages: any[]) => {
        this.dataMessages = []
        const transformedData = messages.map(obj => {
          const id = Object.keys(obj)[0];
          const data = obj[id];
          return { id, ...data };
        });
        return transformedData.filter(message => message.groupId === this.datachatsid);
      })
    ).subscribe((filteredMessages: any[]) => {
      for (let message of filteredMessages) {
        const existingIndex = this.dataMessages.findIndex((data: any) =>
          data.id === message.id
        );
        if (existingIndex === -1) {
          for (let x of this.users$.value) {
            user = Object.values(x);
            if (user[0].userid === message.senderId) {
              this.dataMessages.push({
                ...message,
                avatar: user[0].avatar,
                userid: user[0].userid,
                username: user[0].username
              });
            }
          }
        }
      }
      console.log(this.dataMessages);
      
    });
  }

  clearChat() {
    for (let message of this.dataMessages) {
      if (message.groupId === this.datachatsid) {
        this.db.list("messages").remove(message.id)
          .then(() => {
            // Reset dataMessages sau khi dữ liệu đã được xóa thành công
            this.dataMessages = [];
          })
          .catch(error => {
            console.error("Xóa dữ liệu không thành công:", error);
          });
      }
    }
  }


  getDataChatsById(id: any) {
    this.datachatsid = id;
    this.processData();
  }

  handleMessage(event: any) {
    event.preventDefault();
      let getElementChat = document.querySelector("#box_message");
      const users = this.users$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });    
      let isCheckUserId = users.some(data => data.userid === "customer" + this.customer.MaKhachHang)
      const messages = this.messages$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });
      
      for(let x of messages){      
        if(x.groupId.includes(this.datachatsid) && x.senderId.includes("admin")){
          this.db.object('messages/' + x.id).update({ isreaduser: true })
        }
      }
      if (!isCheckUserId) {
        this.msgtoast.showToast({
          title:"Bạn cần phải đăng nhập",
          type:"warrning"
        })
        const data = {
          userid: "customer" + this.customer.MaKhachHang,
          username: this.customer.HoVaTen,
          avatar: this.customer.Anh
        };
        
        this.db.list('users').push(data).then(() => {
          this.db.list('users').valueChanges().subscribe(users => {
            this.users$.next(users);
          });
        })
          .catch(error => {
            console.error("Thêm dữ liệu không thành công:", error);
          });
      } else {
        if (getElementChat) {
          getElementChat.classList.toggle('show');
          let foundChat = false;
          let subscription = this.chats$.subscribe((chats: any[]) => {
            console.log(chats);
            
            chats.forEach((chatObj: any) => {
              const chatId = Object.keys(chatObj)[0]; // Lấy khóa bí mật của cuộc trò chuyện
              const chat = chatObj[chatId];
              console.log(chatId,chat);
              
              const members = chat.members || [];     
              console.log(members,this.customer.MaKhachHang);
              console.log(members.includes("customer" + this.customer.MaKhachHang));
                       
              if (members.includes("customer" + this.customer.MaKhachHang)) {
                this.getDataChatsById(chatId);
                foundChat = true;
              }              
            });
            console.log(foundChat);
            
          });
  
          if (!foundChat) {
            // Nếu không tìm thấy, tạo một cuộc trò chuyện mới
            const chatData = {
              roomname: '',
              members: ["customer" + this.customer.MaKhachHang],
              lastMessage: {
                "messageId": "",
                "senderId": "",
                "content": "",
                "timestamp": ""
              }
            };
            this.db.list('chats').push(chatData).then(() => {
              const chats = this.chats$.value.map(obj => {
                const id = Object.keys(obj)[0];
                const data = obj[id];
                return { id, ...data };
              });
  
              chats.forEach((chatObj: any) => {
                const member = chatObj.members || []
  
                if (member.includes("customer" + this.customer.MaKhachHang)) {
                  this.getDataChatsById(chatObj.id);
                }
              });
  
            })
              .catch(error => {
                console.error("Thêm dữ liệu không thành công:", error);
              });
          }
  
          subscription.unsubscribe();
        } else {
          this.msgtoast.showToast({
            title: "Bạn cần đăng nhập",
            type: "warning"
          });
        }
      }
    
  }



  getQuantityResend(){
    if(this.messages$.value.length>0 && this.chats$.value.length>0){

      const messages = this.messages$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });      

      const chats:any = this.chats$.value.map(obj => {
        const id = Object.keys(obj)[0];
        const data = obj[id];
        return { id, ...data };
      });
      
      const filteredChats = chats.filter((chat:any) => chat.members.some((member: string) => member.includes("customer" + this.customer.MaKhachHang)));
      if(filteredChats){  
        this.datachatsid = filteredChats[0].id      
        this.quantityResend = messages.reduce((sum:any,data:any)=>{      
          if(data.groupId.includes(filteredChats[0].id) && !data.isreaduser){
            return sum+1
          } 
          else{
            return sum
          }
        },0)
        
      }
    }
    
  }

  handleClick(event: Event) {
    event.preventDefault();
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (currentScroll > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: currentScroll - (currentScroll / 5),
          behavior: 'auto'
        });
        this.handleClick(event);
      });
    }
  }

  linkFacebook(){
    window.open(this.orther.LienKetFacebook,"_blank")
  }

  linkInstagram(){
    window.open(this.orther.LienKetInstagram,"_blank")
  }

  hideBoxMsg() {
    let getElementChat = document.querySelector("#box_message");
    if (getElementChat) {
      getElementChat.classList.toggle('show');
    }
  }

  scrollEnd() {
    const messageContent = document.querySelector('.box_message__content');
    messageContent!.scrollTop = messageContent!.scrollHeight - messageContent!.clientHeight;
  }
}
