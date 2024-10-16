const userModel = require('../models/userModel');

/**
 * Manejador del login del usuario
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const loginUser = async (req, res) => {
  console.log('Login request received: ', req.body);
  const { username, password } = req.body;

  try {
    const user = await userModel.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparador de la contraseña (aquí podemos hashearla)
    const isPasswordValid = (user.user_password === password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Comprobación usuario verificado
    if (!user.verified) {
      return res.status(403).json(
        { message: 'Usuario sin verificar. Un administrador te validará pronto.' }
      );
    }
    console.log(`User ${username} logged in successfully.`);
    return res.status(200).json(
      {
         message: '¡Acceso correcto!',
         user_id: user.id 
      });
  } catch (error) {
    console.error('Error durante el acceso:', error.message);
    return res.status(500).json({ message: 'Error durante el acceso' });
  }
};

/**
 * Manejador del admin check
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const checkAdmin = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Comprueba que el user_id se encuentre en admin_list
    const isAdmin = await userModel.checkIfAdmin(user_id);

    if (isAdmin) {
      return res.status(200).json({ message: 'Entrando en ajustes como administrador' });
    } else {
      return res.status(200).json({ message: 'Entrando en ajustes de usuario' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginUser,
  checkAdmin,
};
