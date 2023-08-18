$(function(){
      
  $.guid= 0;

  $("#btnLoad").click(function(){
    LoadData();
  });

});

document.addEventListener('DOMContentLoaded', assignClickHandlerNew)

function assignClickHandler () {
  document.getElementById('addRec').addEventListener('click', function () {
    const startYear = document.getElementById('startYear').value
    if (startYear < 2000) {
      window.alert('Incorrect year: ' + startYear)
      return
    }
    const fullName = document.getElementById('fullName').value
    const major = document.getElementById('major').value

    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const time = hours + ':' + minutes

    const newEntry = time + ' - ' + fullName + ', ' + major + ', ' + startYear

    const enteredRecords = document.getElementById('enteredRecords')
    let newChild = document.createElement('li')
    newChild.appendChild(document.createTextNode(newEntry))

    enteredRecords.appendChild(newChild)

    document.getElementById('inputs').reset()
  })
}

function assignClickHandlerNew () {
  document.getElementById('addRec').addEventListener('click', function () {
    
    const startYear = document.getElementById('startYear').value
    
    if (startYear < 2000) {
      window.alert('Incorrect year (less than 2000): ' + startYear)
      return
    }

    if (startYear > 2023) {
      window.alert('Incorrect year (greater than 2023): ' + startYear)
      return
    }

    const fullName = document.getElementById('fullName').value
    const major = document.getElementById('major').value
   
    const time = GetTime();
    
    //https://stackoverflow.com/questions/5612582/using-jquery-guid
    AddData(fullName,GetUniqueId(),major,startYear);

    document.getElementById('inputs').reset();

  })
}

function GetTime(){
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const time = hours + ':' + minutes
    return time;
}

function AddData(fName, ID, Mjr, SYear){
  
  const person = {fullName:fName , id:ID, major:Mjr, startYear:SYear};
  //alert(JSON.stringify(person));
  //alert($("#inputs").serialize());
  $.ajax({type: "POST",url: " http://localhost:8081/user", crossDomain:true, data:$("#inputs").serialize(), success: function (response) {alert('user ' + person.fullName + ' added');LoadData(); },
    error: function (xhr, status) {
        alert("error");
    }
  });

}

/*--
  found this here: https://stackoverflow.com/questions/5612582/using-jquery-guid
--*/
function GetUniqueId(){

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
    function(c) 
    {
        var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

}

function DeleteUser(id){
  //alert('del mthd:' + id);
  $.ajax({type: "DELETE",url: " http://localhost:8081/user/"+id, crossDomain:true, success: function (response) {alert('user ' + id + ' deleted');LoadData(); },
    error: function (xhr, status) {
        alert("error");
    }
  });
}

function LoadData(){

    $.ajax({url: " http://localhost:8081/users", crossDomain:true, dataType: "json",success: function (response) {
          
          var data = response.records;
          var content="";
          var newList = "";
          var time = GetTime();

          for (var x = 0; x < data.length; x++) {
            var time = GetTime();
            content = "<li>";
            content += time + "-" + data[x].id + " - " + data[x].fullName + ", ";
            content += data[x].major + ", " + data[x].startYear;                
            content += "<input type='button' class='delbtn' value='delete' id='" + data[x].id + "' title='click to delete'/></li>";
           
            newList += content;
          }
          
          $("#LoadedRecords").html(newList);

          $(".delbtn").click(function(){
            DeleteUser($(this).attr("id"));
          });

        },
        error: function (xhr, status) {
            alert("error");
        }
    });

}