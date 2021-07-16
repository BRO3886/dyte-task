import { UUIDV4 } from 'sequelize'
import { Model } from 'sequelize'

interface AdminAttributes {
  id: string
  username: string
  password: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Admin extends Model<AdminAttributes> implements AdminAttributes {
    id!: string
    username!: string
    password!: string
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(model: any) {
      Admin.belongsToMany(model.Webhook, {
        through: 'WebhookAssignments',
      })
    }
  }
  Admin.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Admin',
    }
  )
  return Admin
}
