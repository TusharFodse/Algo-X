const {
  exec
} = require("child_process");

exports.finetuneModel =
async (req, res) => {

  try {

    const { symbol } =
      req.body;

    exec(

      `"venv\\Scripts\\python.exe" Python-ai/finetune.py ${symbol}`,

      (error, stdout, stderr) => {

        console.log("STDOUT:");
        console.log(stdout);

        console.log("STDERR:");
        console.log(stderr);

        if (error) {

          console.log(error);

          return res.status(500).json({

            success: false,

            error:
              stderr || error.message
          });
        }

        res.json({

          success: true,

          message: stdout
        });
      }
    );

  } catch (err) {

    res.status(500).json({

      success: false,

      error: err.message
    });
  }
};