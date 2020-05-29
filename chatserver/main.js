const connectDB = require('./util/database');
const config = require('./config')
const util = require('./util/getRandomAvatar')
const Group = require('./model/group');

connectDB().then(async () => {
    const group = await Group.findOne({isDefault: true})
    if (!group) {
        try {
            const defaultGroup = await Group.create({
                name: config.defaultGroupName,
                avatar: util.getRandomAvatar(),
                isDefault: true
            })
        } catch(err) {
            console.log(err)
        }
    } else if(group.name !== config.defaultGroupName) {
        group.name = config.defaultGroupName;
        await group.save();
    }
}).catch(err => {
    console.log(err)
})
