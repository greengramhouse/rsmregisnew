    // เมื่อหน้าเว็บโหลดเสร็จ
    let userid;
    let name;
    let picurl;
    let stat;
    let sendDataObj
    window.onload = function(e) {
      liff.init({ liffId: "2004520989-jWLoz3qw" }, function() {
        liff.ready.then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile().then(profile => {
              name = profile.displayName;
              userid = profile.userId;
              picurl = profile.pictureUrl;
              stat = profile.statusMessage;
            });

          } else {
            liff.login();
          }
        })
          .catch((err) => {
            console.error(err.message);
          });
      });
    }

// เมื่อกดปุ่มแสดงรายละเอียด
document.getElementById("btnSearch").addEventListener("click", function(event) {
  event.preventDefault(); // หยุดการกระทำแบบปกติของฟอร์ม
  var custCode = document.getElementById("custCodeInput").value; // รับค่า CustCode จากฟอร์ม
  // แสดง SweetAlert loading
  Swal.fire({
    title: "Loading...",
    html: "Please wait while loading data...",
    didOpen: () => {
      Swal.showLoading();
    }
  });
  fetch('https://script.google.com/macros/s/AKfycbzrTZeDQgF9ekKXwnnzmJv-B2yxdeAPZE974lDbMLgbTqFc6gMjp3LEn9QTrSiS85Mn/exec?id=' + custCode)
    .then(response => response.json())
    .then(data => {
      // ปิด SweetAlert หลังจากโหลดข้อมูลเสร็จสิ้น
      console.log(data)
      sendDataObj = data
      Swal.close();
      // แสดงข้อมูลที่ได้รับจาก API ในรูปแบบตารางและจัดกลางจอ
var tableHtml = `
<div class="table-container mb-5">
  <table class="table-auto w-full">
    <tbody>
      ${Object.keys(data).map(key => {
        let headerText = key;
        switch (key) {
          case 'CardCode':
            headerText = 'รหัสร้านค้า';
            break;
          case 'CardName':
            headerText = 'ชื่อร้านค้า';
            break;
          case 'Phone1':
            headerText = 'เบอร์โทรศัพท์';
            break;
          case 'BranchPreFix':
            headerText = 'รหัสสาขา';
            break;
          case 'TASSeller':
            headerText = 'พนักงาน';
            break;
          case 'StreetNo':
            headerText = 'ที่อยู่';
            break;
          case 'District':
          case 'City':
          case 'County':
          case 'ZipCode':
            headerText = '';
            break;
        }
        return `
          <tr>
            <th class="border px-4 py-2 text-sm text-left">${headerText}</th>
            <td class="border px-4 py-2 text-sm">${data[key]}</td>
          </tr>
        `;
      }).join('')}

    </tbody>
  </table>
  <label for="custCodeInput" class="text-sm font-medium text-gray-700 mr-2 mt-4">กรณีแก้ไข เพิ่มเติมข้อมูล:</label>
  <textarea id="textareaInput" name="textareaInput" rows="5" class="w-full"></textarea>
  <button id="btnSubmitForm" onclick="handleSubmitForm()" type="button" class="hidden inline-flex justify-center items-center px-4 py-2 mt-4 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"><i class="fa-solid fa-floppy-disk"></i>ลงทะเบียน </button>
</div>
`;




      document.getElementById("dataDisplay").innerHTML = tableHtml;
      // แสดงโปรไฟล์ผู้ใช้
      document.getElementById("profileDisplay").innerHTML = `
        <div class="text-center">
          <img src="${picurl}" alt="Profile Picture" class="mx-auto w-24 h-24 rounded-full">
          <p class="mt-2 text-lg font-semibold">${name}</p>
          <p class="text-sm text-gray-500">${stat}</p>
        </div>
      `;
      // เมื่อข้อมูลถูกโหลดเสร็จแล้ว ให้แสดงปุ่ม submitForm
      document.getElementById("btnSubmitForm").classList.remove("hidden");
      document.getElementById("btnSearch").classList.add("hidden");
    })
    .catch(error => {
      console.error('เกิดข้อผิดพลาด:', error);
      // แสดง SweetAlert หากเกิดข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to load data.',
      });
    });
});

// เมื่อกดปุ่ม submitForm
// document.getElementById("btnSubmitForm").addEventListener("click", function(event) {
//   event.preventDefault(); // หยุดการกระทำแบบปกติของฟอร์ม
//   handleSubmitForm()
// })
    
    document.getElementById("custCodeInput").addEventListener("input", function(event) {
    const input = event.target.value;
    const numericInput = input.replace(/\D/g, ''); // เอาแค่ตัวเลข
    event.target.value = numericInput; // กำหนดค่าให้ input เป็นแค่ตัวเลข
});



async function handleSubmitForm() {
  const codeshop = document.getElementById('custCodeInput').value;
  const note = document.getElementById("textareaInput").value;
  Swal.fire({
    title: "Loading...",
    html: "Please wait while loading data...",
    didOpen: () => {
      Swal.showLoading();
    }
  });

  let obj = {
    codeshop: codeshop,
    userid: userid,
    note: note,
    sendDataObj: sendDataObj
  };
  const url = "https://script.google.com/macros/s/AKfycbzrTZeDQgF9ekKXwnnzmJv-B2yxdeAPZE974lDbMLgbTqFc6gMjp3LEn9QTrSiS85Mn/exec";

  const formData = new FormData();
  formData.append('objs', JSON.stringify(obj));

  try {
    const response = await fetch(url + "?type=1", {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      Swal.close();
      const json = await response.json();

      if (json.status === "200") {
        // ดำเนินการเมื่อบันทึกข้อมูลสำเร็จ


        if (liff.getContext().type !== 'none' && liff.getContext().type !== 'external') {
          // ส่งข้อความ Flex Message ถ้าอยู่ในแอพ LIFF
          const message = createFlexMessage(obj);

          liff.sendMessages([message])
            .then(() => {
              setTimeout(function () {
                
                Swal.fire({
                  title: "ยินดีต้อนรับ!",
                  text: "ขอบคุณที่ลงทะเบียนกับ RSM",
                  icon: "success"
                }).then(() => {
                  liff.closeWindow();
                  
                });
              }, 1000);        
            
            })
            .catch((err) => {
              console.error(err.code, error.message);
            });
        } else {
          // แสดง Alert สำหรับเว็บบราวเซอร์
          alert('บันทึกข้อมูลเรียบร้อย');
        }
      } else if (json.status === "400") {
        // แสดงข้อความผิดพลาดหากบันทึกข้อมูลไม่สำเร็จ
        
        Swal.fire({
          title: "ขออภัย!",
          text: "พบข้อผิดพลาดเรากำลังเร่งแก้ไข ขอบคุณค่ะ",
          icon: "error"
        }).then(() => {
          liff.closeWindow();
        });
      }
    } else {
      Swal.close();
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    // แสดงข้อความผิดพลาดหากมีปัญหาในการส่งข้อมูลไปยังแอปสคริปต์
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ โปรดลองอีกครั้งภายหลัง",
      icon: "error"
    });
  }
}


function createFlexMessage(obj){
  let noteset = ""
  if(obj.note == ""){
    noteset = " - "
  }else {
    noteset = obj.note
  }  
  
  return {
  "type": "flex",
  "altText": "Rsm flex message",
  "contents": {
  "type": "bubble",
  "size": "giga",
  "hero": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "image",
        "url": "https://res.cloudinary.com/gukkghu/image/upload/v1711769666/gukkghu/RSM-group-logo-outline_gkz98c.png",
        "offsetTop": "30px"
      }
    ],
    "margin": "xxl",
    "spacing": "none",
    "maxHeight": "150px",
    "height": "150px"
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "ขอบคุณที่ลงทะเบียนกับ RSM",
        "weight": "bold",
        "color": "#1DB446",
        "size": "sm",
        "align": "center"
      },
      {
        "type": "separator",
        "margin": "xxl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "รหัสร้านค้า",
                "size": "sm",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.CardCode,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "ชื่อร้านค้า",
                "size": "sm",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.CardName,
                "size": "md",
                "color": "#0E46A3",
                "align": "end",
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "ที่อยู่",
                "size": "sm",
                "color": "#555555",
                "flex": 0
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.StreetNo,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "size": "sm",
                "color": "#555555",
                "flex": 0,
                "text": " "
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.District,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "size": "sm",
                "color": "#555555",
                "flex": 0,
                "text": " "
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.City,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "size": "sm",
                "color": "#555555",
                "flex": 0,
                "text": " "
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.County,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "size": "sm",
                "color": "#555555",
                "flex": 0,
                "text": " "
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.ZipCode,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "เบอร์โทรศัพท์",
                "size": "sm",
                "color": "#555555"
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.Phone1,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "margin": "xxl",
            "contents": [
              {
                "type": "text",
                "text": "เพิ่มเติม",
                "size": "sm",
                "color": "#555555"
              },
              {
                "type": "text",
                "text": ""+noteset,
                "size": "sm",
                "color": "#0E46A3",
                "align": "end",
                "wrap": true
              }
            ]
          },          
          {
            "type": "separator",
            "margin": "xxl"
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "รหัสสาขา",
                "size": "sm",
                "color": "#555555"
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.BranchPreFix,
                "size": "sm",
                "color": "#4793AF",
                "align": "end",
                "weight": "bold"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "พนักงาน",
                "size": "sm",
                "color": "#555555"
              },
              {
                "type": "text",
                "text": ""+obj.sendDataObj.TASSeller,
                "size": "sm",
                "color": "#4793AF",
                "align": "end",
                "weight": "bold"
              }
            ]
          }
        ]
      },
      {
        "type": "separator",
        "margin": "xxl"
      },
      {
        "type": "box",
        "layout": "horizontal",
        "margin": "md",
        "contents": [
          {
            "type": "text",
            "text": "Rec id",
            "size": "xs",
            "color": "#aaaaaa",
            "flex": 0
          },
          {
            "type": "text",
            "text": "#"+new Date().getTime(),
            "color": "#aaaaaa",
            "size": "xs",
            "align": "end"
          }
        ]
      }
    ]
  },
  "styles": {
    "footer": {
      "separator": true
    }
  }
}
}
}