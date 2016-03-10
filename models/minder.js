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
	}, { 
		hooks : {
			beforeValidate: function (minder) {
				if ( typeof(minder.description) === "string" ) {
					minder.description = minder.description.trim();
				}
			}
		}

	});
};
