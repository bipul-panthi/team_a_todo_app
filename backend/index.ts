import express from "express";
import mysql  from "mysql2/promise"


const PORT: number = 8080;
const app = express();
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'tasks_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.listen(PORT, ():void => {
    console.log(`Start on port ${PORT}.`);
});

process.on('SIGINT',()=>{
    pool.end();
    console.log('Connection pool closed');
    process.exit(0);
})
app.get("/", async (req: express.Request, res: express.Response) => {
    try {
      console.log("before");
      await pool.execute("DO SLEEP(3)");
      console.log("after");
      res.send("Hello world");
    } catch (err: any) {
      res.send(err.message);
    }
});

app.get("/insert", async (req: express.Request, res: express.Response) => {
    console.log('insert running')
    try{
        const tasks = req.query.tasks
        const deadline = req.query.deadline

        console.log(deadline,tasks);
        const answer : any = await pool.execute(`insert into todo (tasks,created_at,deadline) values('${tasks}',CURRENT_TIMESTAMP,'${deadline}')`);
        console.log("insert done")
        console.log(answer[0])

        const id = answer[0]["insertId"]

        const display: any = await pool.execute (`select * from todo where id = ${id}`)
        res.json(display[0][0]);
    }
    catch(err:any){
        res.send(err.message)
    }
});


app.get("/select", async (req: express.Request, res: express.Response) => {
    let status = req.query.status

    try
    {
        if(status != undefined)
        {
            let [rows, fields] = await pool.execute(`select *,(deadline - current_date()) as priority from todo where status = ${status};`)
            let json = JSON.stringify(rows)
            console.log(typeof rows)
            
            if(Object.keys(rows).length == 0)
            {
                res.send("そのステータスのrowsが存在しない")
            }
            const result = 
                {
                    "status" : 200,
                    "tasks" : rows
                }
            
            res.send(result)
        }else
        {
            let [rows, fields] = await pool.execute(`select *,(deadline - current_date()) as priority from todo;`)
            let json = JSON.stringify(rows)
            const result = 
            {
                "status" : 200,
                "tasks" : rows
            }
            res.send(result)
        }
        
    }catch(err: any)
    {
        console.log(err)
    }
});

app.get("/complete", async (req: express.Request, res: express.Response) => {
    let id = req.query.id

    try{
        const answer : any = await pool.execute(`update todo set status=1 where id = ${id}`);
        const display: any = await pool.execute (`select * from todo where id = ${id}`)
        res.json(display[0][0]);

    }catch(err:any){
        console.log(err);
    }
});

app.get("/priority", async (req: express.Request, res: express.Response) => {

    try{
        const display: any = await pool.execute (`select *,(deadline - current_date()) as priority from todo order by priority asc`);
        res.json(display[0]);

    }catch(err:any){
        console.log(err);
    }
});