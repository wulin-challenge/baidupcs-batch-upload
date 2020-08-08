function checkmetamsg(stdout) {
    const infoarr = stdout
        .split("--------------")?.[1]
        ?.split(/\s+/)
        ?.filter(Boolean);
    return infoarr[0] === "类型" && infoarr[1] === "文件";
}
export async function checkexist(remotefile) {
    const fileexist = await retry(
        async () => {
            const result = await execmeta(remotefile);
            const { stdout, stderr } = result;
            const 记录日志 = {
                remotefile,
                stdout,
                stderr,
            };
            console.log(JSON.stringify(记录日志, null, 4));
            if (stdout.includes(notexistmsg)) {
                return false;
            } else if (checkmetamsg(stdout)) {
                return true;
            } else {
                throw new Error(
                    "exec command failure! baidupcs-go:" +
                        "\n" +
                        stdout +
                        "\n" +
                        stderr
                );
            }
        },
        {
            times: 5,
            onFailedAttempt: async (e) => {
                console.warn(e);
                console.warn("运行错误，3秒后重试");
                await sleep(3000);
            },
        }
    );
    return fileexist;
}
import execmeta from "./execmeta.js";
import pupkg from "@shanyue/promise-utils";
const { retry, sleep } = pupkg;
const notexistmsg =
    "遇到错误, 远端服务器返回错误, 代码: 31066, 消息: 文件或目录不存在";