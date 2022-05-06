import express, { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { addReading, getReading, Reading } from './database';
import { isString } from 'util';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post('/data', async (req, res) => {
  // TODO: parse incoming data, and save it to the database
  // data is of the form:
    //  {timestamp} {name} {value}
    let datas: Reading[] = [];
    var result = true;
    // Splitting the incoming text format data and forming a list out of it which contains each reading as a single item.
    const incomingdatas = req.body.toString().replace(/\r\n/g, '\n').split('\n');
    // looping through the entire list of data and then identifying each individual entity
    for (let incomingdata of incomingdatas) {
        var splitteddata = incomingdata.split(" ", 3);
        var datadate = new Date(parseInt(splitteddata[0]));
        var value = parseFloat(splitteddata[2]);
        try {
            if (!isNaN(value) && isString(splitteddata[1])) {
                let data: Reading = {
                    time: datadate.toISOString(),
                    name: splitteddata[1],
                    value: value
                };
                datas.push(data);
            }
            else {
                result = false;
                break;
            }
        }
        catch {
            result = false;
        }  
    }
    if (result) {
        for (var data of datas) {
            addReading((data.time).split("T")[0], datas);
        }
    }
    return res.json({ success: result });
});

app.get('/data', async (req, res) => {
    // TODO: check what dates have been requested, and retrieve all data within the given range
    const fromDate: string = req.query.from as string;
    const toDate: string = req.query.to as string;
    let retrieveddatas: Reading[] = [];
    for (var d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) {
        var data = getReading(d.toDateString());
        if (data != null) {
            retrieveddatas = data;
        }
    }
    console.log(JSON.stringify(retrieveddatas));
    return res.json({ success: true });
});

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));
