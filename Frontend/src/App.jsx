import { useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setStatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });

      const totalemail = emailList.map(function (item) {
        return item.A;
      });

      console.log("Extracted Emails:", totalemail);
      setEmailList(totalemail);
    };

    reader.readAsArrayBuffer(file);
  }

  function send() {
    console.log("Sending Emails:", emailList);
    setStatus(true);

    axios
        .post("https://backend-2otwckj2a-ajays-projects-8ce49744.vercel.app//sendemail", { msg: msg, emaillist: emailList })
        .then(function (data) {
            if (data.data === true) {
                alert("Email Sent Failed");
                setStatus(false)
            } else {
                alert("Email Sent Successfully");
                setStatus(false)
            }
        })
        .catch(function (error) {
            console.error("Error in sending email:", error);
        });
}


  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your bussiness with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 px-2 outline-none border border-black rounded-md" placeholder="Enter the Email text..."></textarea>

        <div>
          <input onChange={handlefile} type="file" className="border-4 border-dashed py-4 px-4 mt-5 mb-5"></input>
        </div>

        <p>Total Emails in the File: {emailList.length}</p>

        <button onClick={send} className="bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit">{status ? "Sending..." : "Send"}</button>

      </div>

      <div className="bg-blue-300 text-white text-center p-8">

      </div>

      <div className="bg-blue-200 text-white text-center p-8">

      </div>

    </div>
  )
}

export default App