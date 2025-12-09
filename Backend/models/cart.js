const {DataTypes}=require("sequelize")
const sequelize=require("../db/connection")

const Cart=sequelize.define("Cart",
    {
        user_id:{type:DataTypes.INTEGER,allowNull:false},
        product_id:{type:DataTypes.INTEGER,allowNull:false},
        qty:{type:DataTypes.INTEGER,defaultValue:1}
    },
    {
        tableName:"carts",
        timestamps:true,
        createdAt:"created_at",
        updatedAt:"updated_at"
    }
)
module.exports=Cart