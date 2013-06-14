exports.encryptPassword = function(password,userDoc)
{
	return helper.util.md5( helper.util.md5(password) + userDoc.username + userDoc.createTime ) ;
}