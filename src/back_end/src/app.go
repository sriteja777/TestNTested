package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var db *gorm.DB
var err error
var Genres [3]string
var allowedOrigins [2]string

type FormData struct {
	Genre string `json:"genre"`
	Title string `json:"title"`
	QuesType []int `json:"quesType"`
	RightAns [][]int `json:"rightAns"`
	Questions []string `json:"questions"`
	Options [][]string `json:"options"`

}


type User struct {
	ID                     uint
	//UserName               string `json:"useName"`
	Name                   string `json:"name"`
	//LastName               string `json:"lastName"`
	//Password               string `json:"password"`
	//PhoneNumber            uint   `json:"phoneNumber"`
	Email                string `json:"email"`
	//EmailVerificationLink string  `json:"emailVerificationLink"`
	//EmailVerified           bool   `json:"emailVerified"`

}

type SendQuiz struct {
	Quiz
	Question
	Option
}

type RegisterForm struct{
	User
	SelfUser
}

type LoginForm struct {
	User
	SelfUser
}

type SocialUserData struct {
	//Name                   string `json:"name"`
	//Email                string `json:"email"`
	//Token string `gorm:"size:1000";json:"token"`
	//ProfilePic string `gorm:"size:512";json:"profilePic"`
	//Provider string `json:"provider"`
	//ProviderId string `gorm:"size:1000";json:"providerId"`
	//UserTableId uint
	User
	SocialUser


}

type SocialUser struct {
	ID uint
	Token string `gorm:"size:1000" json:"token"`
	ProfilePic string `gorm:"size:512" json:"profilePic"`
	Provider string `json:"provider"`
	ProviderId string `gorm:"size:1000" json:"providerId"`
	UserTableId uint
}

func(SelfUser) TableName() string {
	return "SELF_USERS"
}

func(SocialUser) TableName() string {
	return "SOCIAL_USERS"
}

type SelfUser struct {
	ID uint
	PhoneNumber string `gorm:"size:20" json:"phoneNumber"`
	Password string `gorm:"size:1000" json:"password"`
	EmailVerificationLink string `gorm:"size:1000"`
	EmailVerified bool
	UserTableId uint
}

func (User) TableName() string {
	return "USERS"
}

//type Question struct {
//	ID       uint   `json:"qn_id"`
//	Question string `json:"question"`
//	Option1  string `json:"Option1"`
//	Option2  string `json:"Option2"`
//	Option3  string `json:"Option3"`
//	Option4  string `json:"Option4"`
//	Type     string `gorm:"type:enum('single_mcq', 'multiple_mcq')";json:"type"`
//	Op1Crct  bool   `json:"op_1_crct"`
//	Op2Crct  bool   `json:"op_2_crct"`
//	Op3Crct  bool   `json:"op_3_crct"`
//	Op4Crct  bool   `json:"op_4_crct"`
//	InQuiz   uint   `json:"in_quiz"`
//
//}
type Question struct {
	ID uint `json:"qn_id"`
	Question string `json:"question"`
	Type string `gorm:"type:enum('single_mcq', 'multiple_mcq')" json:"type"`
	InQuiz uint `json:"in_quiz"`
	Option []Option `json:"option" gorm:"foreignkey:InQuestion"`

}
type Option struct{
	ID uint `json:"op_id"`
	Option string `json:"option_string"`
	IsCorrect bool `json:"is_correct"`
	InQuestion uint `json:"in_question"`

}


type Quiz struct {
	ID uint `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
	Title string `json:"title"`
	Genre string `gorm:"type:enum('movies', 'politics', 'sports')" json:"genre"`
	Questions []Question `gorm:"foreignkey:InQuiz"`

}


func(Question) TableName() string {
	return "QUESTIONS"
}

func(Quiz) TableName() string {
	return "QUIZZES"
}

func (Option) TableName() string {
	return "OPTIONS"
}

func find(arr []int, x int) bool {
	for _, element := range arr {
		if element == x {
			return true
		}
	}
	return false
}
// func GetQuizes() {
// 	a := 1
// }
// func DeleteQuiz() {
// 	b := 2
// }

func setOriginHeader(p *gin.Context) {
	requestOrigin := p.Request.Header.Get("Origin")
	accessOrigin := ""
	for _, allowedOrigin := range allowedOrigins {
		if allowedOrigin == requestOrigin {
			accessOrigin = requestOrigin
			break
		}
	}
	p.Header("access-control-allow-origin", accessOrigin)
}
func CreateQuiz(c *gin.Context) {
	setOriginHeader(c);

	fmt.Println(c.Params.Get("genre"))
	fmt.Println(c.Params.ByName("title"))
	//var q Question
	//c.BindJSON(&q)
	var f FormData
	c.BindJSON(&f)
	fmt.Println("dfgd", c, f.Title)
	var qz Quiz


	qz.Title = f.Title
	qz.Genre = f.Genre
	db.Create(&qz)
	noq := len(f.Questions)
	for i := 0; i<noq; i++ {
		var qn Question
		qn.Question = f.Questions[i]
		qn.InQuiz = qz.ID
		if f.QuesType[i] == 0 {
			qn.Type = "single_mcq"
		} else if f.QuesType[i] == 1 {
			qn.Type = "multiple_mcq"
		}
		db.Create(&qn)
		for j, opt := range f.Options[i] {
			var op Option
			op.InQuestion = qn.ID
			op.Option = opt
			op.IsCorrect = find(f.RightAns[i], j)
			db.Create(&op)
		}
	}
	//db.Save(qz)
	c.JSON(200, qz)
	//fmt.Println(c.Params)

}

//func setOriginheader(c **gin.Context) {
//
//}
func GetGenres(c *gin.Context)  {
	setOriginHeader(c);
	c.JSON(200, Genres)

}

func CreateUser(c *gin.Context)  {
	fmt.Println("came to create user")
	var rfd RegisterForm
	c.BindJSON(&rfd)
	result := db.Where("email = ?",rfd.User.Email).Find(&rfd.User)
	//fmt.Println(result.Row())
	if result.RecordNotFound() {
		fmt.Println("came if")
		db.Create(&rfd.User)
		rfd.SelfUser.UserTableId = rfd.User.ID
		db.Create(&rfd.SelfUser)
		setOriginHeader(c)
		c.JSON(200, gin.H{"message": "Success", "userData": rfd.User})
		return
	} else {
		fmt.Println("came else")

		setOriginHeader(c)
		c.JSON(200, gin.H{"message": "User already there", "userData": rfd.User})

	}

}

func CreateSocialUser(c *gin.Context) {
	//setOriginheader(&c);
	//c.Header("access-control-allow-origin", "*")
	setOriginHeader(c)
	fmt.Println("came to create social user")
	var sud SocialUserData
	c.BindJSON(&sud)
	fmt.Println(sud)
	result := db.Where("provider_id = ?", sud.ProviderId).Find(&SocialUser{})
	if result.RecordNotFound() {

		//	var usr User
		db.Create(&sud.User)
		sud.SocialUser.UserTableId = sud.User.ID

		db.Create(&sud.SocialUser)
		c.JSON(200, gin.H{"message": "Success", "userData": sud.User, "existingUser": false})
		return
		//	usr.Name =
	} else {
		var results User
		//db.Table("USERS").Select("USERS.name").Joins("inner join SOCIAL_USERS on SOCIAL_USERS.user_table_id = USERS.id").Scan(&results)
		//r := db.Table("USERS").Select("USERS.name").Joins("inner join SOCIAL_USERS on SOCIAL_USERS.user_table_id = USERS.id").
		//fmt.Println("r.Row -> ", r)
		//fmt.Println("results-> ", results)
		db.Table("USERS").Select("USERS.name, USERS.id").Joins("inner join SOCIAL_USERS on SOCIAL_USERS.user_table_id = USERS.id").Where("SOCIAL_USERS.provider_id = ?",sud.ProviderId).Find(&results)

		fmt.Println(results.ID, results.Name)
		c.JSON(200, gin.H{"message": "Success", "userData": results, "existingUser": true})
	}

	//fmt.Println(result.Value)
	//fmt.Println(result)
}

func LoginSelfUser(c *gin.Context) {
	setOriginHeader(c)
	var u LoginForm
	c.BindJSON(&u)
	if db.Table("USERS").Where("email = ?",u.Email).RecordNotFound() {
		fmt.Println("came if")
		c.JSON(200, gin.H{"message": "Failure", "existingUser": false, "userdata": nil})
	} else {
		var sfu SelfUser
		fmt.Println("came else")
		db.LogMode(true)
		db.Table("USERS").Select("SELF_USERS.password").Joins("INNER JOIN SELF_USERS ON SELF_USERS.user_table_id = USERS.id").Where("USERS.email = ?",u.Email).Find(&sfu)
		fmt.Println("pass-> ", u.Password)
		fmt.Println(sfu.Password)
		if u.Password == sfu.Password {
			c.JSON(200, gin.H{"message": "Success", "userData": u.User, "existingUser": true})
		} else {
			c.JSON(200, gin.H{"message": "Failure", "userData": u.User, "existingUser": false})
		}
	}

}

func LoginSocialUser(c *gin.Context) {
	setOriginHeader(c);
}

func GetQuizzes(c *gin.Context) {
	var quizzes []Quiz
	if err := db.Find(&quizzes).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		setOriginHeader(c)
		c.JSON(200, quizzes)
	}
}


func Train(c *gin.Context) {

}

func GetQuiz(c *gin.Context) {
	var qn []Question
	var qz Quiz
	setOriginHeader(c)
	quizId := c.Params.ByName("id")
	db.Where("id = ?",quizId).Find(&qz)

	db.Table("QUESTIONS").Select("QUESTIONS.id, QUESTIONS.question, QUESTIONS.type").Joins("INNER JOIN QUIZZES ON QUESTIONS.in_quiz = QUIZZES.id AND QUIZZES.id = ?",quizId).Scan(&qn)

	if err != nil {
		fmt.Println()
	}

	fmt.Println("qn -> ", qn, "I am printed")

	if len(qn) == 0 {
		c.JSON(200, gin.H{"message": "No such quiz with Id " + string(quizId), "quiz": []int{}, "result": "Failure"})
	}
	var op = make([][]Option, len(qn))
	for i, question := range qn {
		db.Table("OPTIONS").Select("OPTIONS.option, OPTIONS.is_correct").Joins("INNER JOIN QUESTIONS ON QUESTIONS.id = OPTIONS.in_question").Where("OPTIONS.in_question = ?", question.ID).Scan(&op[i])
	}
	var qn_str []string
	var ques_type []int
	op_str := make([][]string, len(qn))
	right_ans := make([][]int, len(qn))
	for i, question := range qn {
		qn_str = append(qn_str, question.Question)
		if question.Type == "single_mcq" {
			ques_type = append(ques_type, 0)
		} else if question.Type == "multiple_mcq" {
			ques_type = append(ques_type, 1)
		}
		for j, option := range op[i] {
			op_str[i] = append(op_str[i], option.Option)
			if option.IsCorrect {
				right_ans[i] = append(right_ans[i], j)
			}

		}



	}
	fmt.Println(qn)
	fmt.Println(op)
	fmt.Println(qn_str, ques_type, op_str, right_ans)
	c.JSON(200, gin.H{"questions": qn_str, "options": op_str, "rightAns": right_ans, "quesType": ques_type, "quiz": qz})
}

func main() {
	db, err = gorm.Open("mysql", "mysql", "root:Sriteja@27@/Quiz_Web_App?charset=utf8&parseTime=True&loc=Local")
	Genres[0] = "movies"
	Genres[1] = "politics"
	Genres[2] = "sports"
	allowedOrigins[0] = "http://127.0.0.1:3000"
	allowedOrigins[1] = "http://localhost:3000"
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{}, &Question{}, &Quiz{}, &Option{}, &SelfUser{}, &SocialUser{})
	db.Model(&Question{}).AddForeignKey("in_quiz", "QUIZZES(id)", "CASCADE", "CASCADE")
	db.Model(&Option{}).AddForeignKey("in_question", "QUESTIONS(ID)", "CASCADE", "CASCADE")
	db.Model(&SocialUser{}).AddForeignKey("user_table_id", "USERS(ID)", "CASCADE", "CASCADE")
	router := gin.Default()
	// router.GET("/quiz/", GetQuizes)
	router.POST("/quiz/", CreateQuiz)
	router.GET("/quiz/", GetQuizzes)
	router.GET("/quiz/:id", GetQuiz)
	router.POST("/suser/", CreateSocialUser)
	router.POST("/user/", CreateUser)
	router.GET("/genres/", GetGenres)
	router.POST("/login/", LoginSelfUser)
	router.POST("/slogin/", LoginSocialUser)
	router.GET("/train/", Train)
	// router.DELETE("/quiz/:id", DeleteQuiz)
	fmt.Printf("hello, world\n")
	router.Run(":7777")
	router.Use(cors.Default())
	// r.GET("/people/", GetPeople)                             // Creating routes for each functionality
	// r.GET("/people/:id", GetPerson)
	// r.POST("/people", CreatePerson)
	// r.PUT("/people/:id", UpdatePerson)
	// r.DELETE("/people/:id", DeletePerson)
}