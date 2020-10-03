
const registerHandler = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!name || !name || !password) {
        return res.status(400).json('Incorrect form submition')
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    }).then(user =>
                        res.json(user[0])
                    )
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => {
            let errorcode = JSON.parse(JSON.stringify(err))
            if (errorcode.code === "23505") {
                res.status(400).json("Email already exists.")
            } else {
                res.status(400).json('Unable to register.')
            }
        })
};

module.exports = {
    registerHandler: registerHandler
};