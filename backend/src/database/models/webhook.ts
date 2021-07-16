import { UUIDV4 } from 'sequelize'
import { Model } from 'sequelize'

interface WebhookAttributes {
  id: string
  url: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Webhook extends Model<WebhookAttributes> implements WebhookAttributes {
    id!: string
    url!: string
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      Webhook.belongsToMany(models.Admin, {
        through: 'WebhookAssignments',
      })
    }
  }
  Webhook.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Webhook',
    }
  )
  return Webhook
}
