
import { travelers, TravelersOption, Req, Res, NextFunction } from "travelers";
import * as apis from "./apis/index";
import * as srvs from "./srvs/index";
import controllers from "./controllers/index";
import config from "./config/index";
import { needAuth } from "./security";
import * as mq from "./srvs/mq";
import * as cluster from "cluster";
import * as os from "os";

const option: TravelersOption = {
    config,
    before: function (app) {

    },
    ready: function (app, srvs) {
        mq.run(srvs);
    },
    srvs,
    security: { needAuth },
    apis,
    controllers,
    after: function (app, srvs) {
        app.use((req: Req, res: Res) => {
            const { codes } = req.srvs;
            return codes.notfind.resJson(res);
        });
    }
};

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log("worker process died,id", worker.process.pid);
        cluster.fork();
    });

} else {
    travelers(option).then(data => {
        // console.log(JSON.stringify(data, null, 4));
    });
}



