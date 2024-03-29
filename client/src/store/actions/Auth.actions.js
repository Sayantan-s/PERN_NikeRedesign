import http from 'utils/http';

import {
    AUTHENTICATING,
    AUTHENTICATION_SUCCESSFULL,
    AUTHENTICATION_FAILED,
    LOGOUT_USER
} from 'store/types/isAuthenticated';

const IS_AUTHENTICATING = () => ({
    type: AUTHENTICATING
});

const IS_AUTHENTICATED = (type, data) => ({
    type,
    payload: data
});

const FAILED_TO_AUTHENTICATE = (error) => ({
    type: AUTHENTICATION_FAILED,
    payload: error
});

const LOGOUT = () => ({
    type: LOGOUT_USER
});

export const logout = (history) => {
    return async (dispatch) => {
        console.log('LOGGING USER OUT');
        try {
            const res = await http.delete('/auth/logout');
            if(res.status === 200){
                dispatch(LOGOUT());
                history.push('/');
            }
        } catch (err) {
            console.log(err.response);
        }
    };
};

const Authenticate_user =
    ({ url = '/auth/register', input_data }, history) =>
    async (dispatch) => {
        try {
            dispatch(IS_AUTHENTICATING());

            const { data, status, headers } = await http({
                method: 'POST',
                url,
                data: input_data
            });

            http.defaults.headers.common['Authorization'] = `Bearer ${headers['x-access-token']}`;

            const decodedPayload = JSON.parse(atob(headers['x-access-token'].split('.')[1]));

            if (
                (url.includes(/register/i) && status === 201) ||
                (url.includes(/login/i) && status === 200)
            ) {
                dispatch(
                    IS_AUTHENTICATED(AUTHENTICATION_SUCCESSFULL, {
                        decodedPayload,
                        ...data
                    })
                );
                history.push('/collectives');
            }
        } catch (error) {
            return dispatch(FAILED_TO_AUTHENTICATE('Failed to authenticate!'));
        }
    };

const getNewAccessTokenOnRefresh = () => async (dispatch) => {
    try {
        const res = await http.get('/utilities/refresh');
    } catch (err) {
        return dispatch(FAILED_TO_AUTHENTICATE('Failed to authenticate!'));
    }
};

export {
    IS_AUTHENTICATING,
    IS_AUTHENTICATED,
    FAILED_TO_AUTHENTICATE,
    LOGOUT,
    Authenticate_user,
    getNewAccessTokenOnRefresh
};
