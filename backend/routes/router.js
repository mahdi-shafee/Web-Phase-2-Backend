const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const { queries } = require('@testing-library/react')

router.post('/submit_answer', async(req, res) => {
    const {username, answer, query} = req.body
    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()

    if (userDataCheck[0].answered.includes(query.question)) {
        let response = {
            response:'You have already answered to this question.'
        }

        res.send(response)
    } else {

        let answered = userDataCheck[0].answered

        if (query.options[query.correct_option - 1] === answer) {
            console.log('correct')
            let newScore = parseInt(userDataCheck[0].score)
            let added_score = 0
    
            if (query.level == 'easy') {
                added_score = 10
            } else if (query.level == 'medium') {
                added_score = 20
            } else if (query.level == 'hard') {
                added_score = 30
            }

            newScore = newScore + added_score
    
            const updateDoc = {
                $set: {
                    score:newScore.toString(),
                    answered:[...answered, query.question]
                },
            };
        
            const options = { upsert:true };
        
            await users.updateOne(
                {username:username},
                updateDoc,
                options
            )

            let response = {
                response:`Congrats! You recieved ${added_score} points.`
            }
    
            res.send(response)
        } else {
            console.log('incorrecr')

            let response = {
                response:'Wrong answer.'
            }

            const updateDoc = {
                $set: {
                    answered:[...answered, query.question]
                },
            };
        
            const options = { upsert:true };
        
            await users.updateOne(
                {username:username},
                updateDoc,
                options
            )

            res.send(response)
        }
    }


})

router.post('/get_all_queries', async(req, res) => {
    let queries = []

    users = schemas.Users
    const designers = await users.find({role:'Designer'}).exec()

    for (let i = 0; i < designers.length; i++) {
        let designer = designers[i]
        for (let j = 0; j < designer.queries.length; j++) {
            queries.push(designer.queries[j])
        }
    }

    const cats = {
        queries:queries
    }

    res.send(cats)
})

router.post('/get_all_categories', async(req, res) => {
    let categories = ['All']

    users = schemas.Users
    const designers = await users.find({role:'Designer'}).exec()

    for (let i = 0; i < designers.length; i++) {
        let designer = designers[i]
        for (let j = 0; j < designer.categories.length; j++) {
            categories.push(designer.categories[j])
        }
    }

    const cats = {
        categories:categories
    }

    res.send(cats)
})

router.post('/follow_unfollow', async(req, res) => {
    const {username, followed_unfollowed} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()
    let followings = userDataCheck[0].followings

    if (followings.includes(followed_unfollowed)) {
        const index = followings.indexOf(followed_unfollowed);

        let new_followings = []

        for (let i = 0; i < followings.length; i++) {
            if (followings[i] != followed_unfollowed) {
                new_followings = [...new_followings, followings[i]]
            }
        }

        const updateDoc = {
            $set: {
                followings:new_followings
            },
        };
    
        const options = { upsert:true };
    
        await users.updateOne(
            {username:username},
            updateDoc,
            options
        )
    } else {
        const updateDoc = {
            $set: {
                followings: [...followings, followed_unfollowed]
            },
        };
    
        const options = { upsert:true };
    
        await users.updateOne(
            {username:username},
            updateDoc,
            options
        )
    }

})

router.post('/get_designers', async(req, res) => {
    const {username} = req.body
    let scores = []

    users = schemas.Users
    const userDataCheck = await users.find({role:'Designer'}).exec()
    const searchingUser = await users.find({username:username}).exec()

    for (let i = 0; i < userDataCheck.length; i++) {
        scores.push({
            name:userDataCheck[i].username,
            queries:parseInt(userDataCheck[i].queries.length),
            following:searchingUser[0].followings.includes(userDataCheck[i].username)
        })
    }

    const scoreBoard = {
        designers:scores
    }

    res.send(scoreBoard)
})

router.post('/get_scores', async(req, res) => {
    const {username} = req.body
    let scores = []

    users = schemas.Users
    const userDataCheck = await users.find({role:'Player'}).exec()
    const searchingUser = await users.find({username:username}).exec()

    for (let i = 0; i < userDataCheck.length; i++) {
        scores.push({
            player:userDataCheck[i].username,
            score:parseInt(userDataCheck[i].score),
            following:searchingUser[0].followings.includes(userDataCheck[i].username)
        })
    }

    const scoreBoard = {
        score_board:scores
    }

    res.send(scoreBoard)
})

router.post('/add_query', async(req, res) => {
    const {username, newQuery} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()
    const queries = userDataCheck[0].queries

    const updateDoc = {
        $set: {
            queries: [...queries, newQuery]
        },
    };

    const options = { upsert:true };

    await users.updateOne(
        {username:username},
        updateDoc,
        options
    )
})

router.post('/add_category', async(req, res) => {
    const {username, category} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()
    const categories = userDataCheck[0].categories

    const updateDoc = {
        $set: {
            categories: [...categories, category]
        },
    };

    const options = { upsert:true };

    await users.updateOne(
        {username:username},
        updateDoc,
        options
    )
})

router.post('/get_categories', async(req, res) => {
    const {username} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()

    response = {
        categories:userDataCheck[0]
    }

    res.send(response)
})

router.post('/get_queries', async(req, res) => {
    const {username} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()

    response = {
        categories:userDataCheck[0]
    }

    res.send(response)
})

router.post('/login', async(req, res) => {
    const {username, password} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username, password:password}).exec()

    if (userDataCheck.length == 0){
        response = {
            status: false,
            role: ''
        }
        res.send(response)
    } else{
        response = {
            status: true,
            role: userDataCheck[0].role
        }
        res.send(response)
    }
    
})

router.post('/signup', async(req, res) => {
    const {username, email, password, role} = req.body

    users = schemas.Users
    const userDataCheck = await users.find({username:username}).exec()

    if (userDataCheck.length != 0) {
        response = {
            status: false,
        }
        res.send(response)
    } else{
        const userData = {
            id:username,
            username:username,
            email:email,
            password:password,
            role:role,
            categories:[
                
            ],
            queries:[
                
            ],
            score: '0',
            followings:[

            ],
            answered:[
                
            ]
        }
    
        const newUser = new schemas.Users(userData)
        const saveUser = await newUser.save()
    
        if (saveUser) {
            response = {
                status: true,
            }
            res.send(response)
        } else {
            response = {
                status: false,
            }
            res.send(response)
        }
    }
})

module.exports = router