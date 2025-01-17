package executors

import (
	"strings"

	"github.com/dotenx/dotenx/runner/config"
	"github.com/dotenx/dotenx/runner/models"
)

func ProcessTask(task *models.TaskDetails) (processedTask *models.Task) {
	processedTask = &models.Task{}
	processedTask.Details = *task
	processedTask.IsPredifined = true
	if task.Type == "Run image" {
		processedTask.IsPredifined = false
		processedTask.Details.Image = task.Body.(map[string]interface{})["image"].(string)
		processedTask.Script = strings.Split(task.Body.(map[string]interface{})["script"].(string), " ")
	} else {
		// // Todo: Check why this is a slice instead of a string
		// envs := make([]string, 0)
		// for _, field := range task.MetaData.Fields {
		// 	if value, ok := task.Body[field.Key]; ok {
		// 		var envVar string
		// 		if field.Type == "code" {
		// 			str := value.(string)
		// 			fileName := fmt.Sprintf("%x", md5.Sum([]byte(str))) + "_" + field.Key
		// 			// fileName := task.Workspace + "_" + field.Key

		// 			// log.Println("File saving started:", time.Now())
		// 			// // upload file to s3 (see dropbox upload file)
		// 			// sess, err := session.NewSession(&aws.Config{
		// 			// 	Region: aws.String("us-east-1")}, // todo: use a variable for this
		// 			// )
		// 			// bucketName := "dotenx" // Todo: use a variable for this

		// 			// // Setup the S3 Upload Manager. Also see the SDK doc for the Upload Manager
		// 			// // for more information on configuring part size, and concurrency.
		// 			// //
		// 			// // http://docs.aws.amazon.com/sdk-for-go/api/service/s3/s3manager/#NewUploader
		// 			// uploader := s3manager.NewUploader(sess)
		// 			// _, err = uploader.Upload(&s3manager.UploadInput{
		// 			// 	Bucket: aws.String(bucketName),
		// 			// 	Key:    aws.String(fileName),
		// 			// 	Body:   bytes.NewReader([]byte(str)),
		// 			// })

		// 			// if err != nil {
		// 			// 	fmt.Println(err)
		// 			// 	return
		// 			// }
		// 			// log.Println("File saving ended:", time.Now())
		// 			// fmt.Println("File saved successfully")

		// 			envVar = field.Key + "=" + fileName
		// 		} else {
		// 			envVar = field.Key + "=" + fmt.Sprintf("%v", value)
		// 		}
		// 		envs = append(envs, envVar)
		// 	}
		// }
		// // processedTask.EnvironmentVariables = envs
		processedTask.EnvironmentVariables = append(processedTask.EnvironmentVariables, "RESULT_ENDPOINT="+task.ResultEndpoint)
		processedTask.EnvironmentVariables = append(processedTask.EnvironmentVariables, "WORKSPACE="+task.Workspace)
		processedTask.EnvironmentVariables = append(processedTask.EnvironmentVariables, "AUTHORIZATION="+config.Configs.Secrets.RunnerToken)
	}
	return
}
