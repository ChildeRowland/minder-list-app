module.exports = function (sequelize, DataTypes) {
	return sequelize.define('minder', {
		description: {
			type: DataTypes.STRING(250),
			allowNull: false,
			len: [1, 250]
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
};
