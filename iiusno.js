import {check, group, sleep} from 'k6';
import http from 'k6/http';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

let params;
let token;

export const options = {
    noCookiesReset: true,
    scenarios: {
        ones: {
            executor: 'constant-arrival-rate',
            duration: '1h',
            rate: 1,
            timeUnit: '1h',
            preAllocatedVUs: 1,
            maxVUs: 50,
        },
        tens: {
            executor: 'constant-arrival-rate',
            duration: '1h',
            rate: 10,
            timeUnit: '1h',
            preAllocatedVUs: 1,
            maxVUs: 50,
        },
        hundreds: {
            executor: 'constant-arrival-rate',
            duration: '1h',
            rate: 100,
            timeUnit: '1h',
            preAllocatedVUs: 1,
            maxVUs: 50,
        },
        thousands: {
            executor: 'constant-arrival-rate',
            duration: '1h',
            rate: 7000,
            timeUnit: '1h',
            preAllocatedVUs: 1,
            maxVUs: 50,
        }
    }
};

function getBaseUrl() {
    return 'https://moslight-stage.mos.ru'
}

function getLoginParams() {
    if (token == null) {
        let body = JSON.stringify({
            username: 'bezgin',
            password: '400nsczxJ<TPMZY$$$'
        })

        group('Логин пользователя', function () {
            let res = http.post(getBaseUrl() + `/asuno/api/user/login/`, body,
                {headers: {'Content-Type': 'application/json'}});
            if (res.status === 200) {
                token = res.cookies.session[0].value;
            } else (console.log('+++ login error +++' + token));
            sleep(1);
        });
        params = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Set-Cookie': 'session=' + token
            }
        };
        return params;
    } else {
        return params
    }
}


export default function ones() {
    group('Получение полного состояния контроллеров', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/state/full/?id=2`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение ошибок на светильниках у контроллера', function () {
        let body = JSON.stringify({
            email: 'fulano@qa.com',
            password: 'teste'
        })

        let res = http.post(getBaseUrl() + `/asuno/api/lamp_alerts/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение событий', function () {
        let body = JSON.stringify({
            id: [3129],
            start: "",
            wait: 1,
            limit: 30,
            hr: true
        })

        let res = http.post(getBaseUrl() + `/asuno/api/events/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение краткого состояния определенных тэгов', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/state/short/?id=3,707,9,4385`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение информации о контроллере', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/controllers/?id=2,3`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение контроллеров по группе', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/controllers/group/?id=33`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение статистики по группам', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/group/statistic/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение timestamp сервера, информации о включении светильников', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/time/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение списка групп контроллеров', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/groups/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение информации о пользователе', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/user/me/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение кварталов по id контроллера', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/controller/3129/quarters/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение данных АИИСКУЭ по контроллеру', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/electricity_meters_readings/?id=3129`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение списка светильников по контроллеру', function () {
        let res = http.get(getBaseUrl() + `/api/controller/3129/lightings/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Поиск контроллера по названию или адресу', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/search_controllers/?item=Тестовая`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт контроллеров из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/controllers/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт рассинхронизированных контроллеров из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/controllers/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт контроллеров с ошибками плавких вставок из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/bad_fuse_controllers/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт контроллеров с ошибками ПО из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/bad_controllers/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт контроллеров с ошибками монтажа из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/bad_assembles/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Экспорт контроллеров не на связи из админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/offline_controllers/export/xls/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение имени контроллеров по группе', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/controllers/name/group/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение списка пользователей', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/users/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение информации о расписании работы объектов НО на текущий год', function () {
        let res = http.get(getBaseUrl() + `/asuno/api/schedule/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Включения света на контакторе', function () {
        // TODO Изменить body после подключения тестового сервера.
        let body = JSON.stringify({
            ids: '1',
            contactor: '1',
            arg: 0
        })

        let res = http.post(getBaseUrl() + `/asuno/api/switch_light/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Переключение режима на контакторе', function () {
        // TODO Изменить body после подключения тестового сервера.
        let body = JSON.stringify({
            ids: '1',
            contactor: '1',
            arg: 1
        })

        let res = http.post(getBaseUrl() + `/asuno/api/switch_light/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение состояния тэга alive контроллера', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/controller/alive/?id=1451`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Изменение контроллера', function () {

        let body = JSON.stringify({
            "name": "АППНО МЭИ",
            "tcp_ip_addresses": [
                {
                    "id": 8172,
                    "ip_address": "10.154.13.52",
                    "port": 4841,
                    "sim_number": "",
                    "controller_id": 2
                },
                {
                    "id": 8173,
                    "ip_address": "10.155.1.70",
                    "port": 4841,
                    "sim_number": "",
                    "controller_id": 2
                }
            ],
            "protocol_id": 1,
            "condition_id": 2,
            "manufacturer_id": 2,
            "gis_id": 123,
            "oek_id": 102712,
            "address": "2-й Краснокурсантский проезд, д. 12, стр. 7, Стадион МЭИ",
            "groups": [
                10
            ],
            "description": "",
            "placement_type": null,
            "invert_sensor_fire": false,
            "invert_sensor_door_shuno": false,
            "invert_sensor_door_pp": false,
            "ignore_sensor_fire": null,
            "ignore_sensor_door_shuno": null,
            "ignore_sensor_door_pp": null,
            "id": 1451,
            "type_id": 1,
            "dimmers": [],
            "invert_value_tag_list": [],
            "ignore_sensor_tag_list": []
        })
        let res = http.put(getBaseUrl() + `/asuno/admin/api/controller/?id=1451`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение информации о контроллере по id для админки', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/controller/?id=3129`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение списка групп контроллеров в админке', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/groups/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение списка производителей контроллеров в админке', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/controller/manufacturers/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Отправление запроса connect_controller контроллеру', function () {
        let body = JSON.stringify({
            id: 3129
        })

        let res = http.post(getBaseUrl() + `/asuno/admin/api/controller/connect/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Синхронизация fuse контроллера', function () {
        let body = JSON.stringify({
            id: 1451
        })
        let res = http.put(getBaseUrl() + `/asuno/admin/api/controller/fuse/presents/sync/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение fuse контроллера', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/controller/fuse/presents/?id=3129`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Установка fuse контроллеру в БД', function () {
        let body = '{"fuse":{"a.1":"evening","a.2":"evening","a.3":"night","a.4":"night","a.5":null,"a.6":null,"a.7":null,"a.8":null,"a.9":null,"a.10":null,"a.11":null,"a.12":null,"a.13":null,"a.14":null,"a.15":null,"a.16":null,"b.1":"evening","b.2":"evening","b.3":"night","b.4":"night","b.5":null,"b.6":null,"b.7":null,"b.8":null,"b.9":null,"b.10":null,"b.11":null,"b.12":null,"b.13":null,"b.14":null,"b.15":null,"b.16":null,"c.1":"evening","c.2":"evening","c.3":"evening","c.4":"night","c.5":null,"c.6":null,"c.7":null,"c.8":null,"c.9":null,"c.10":null,"c.11":null,"c.12":null,"c.13":null,"c.14":null,"c.15":null,"c.16":null},"id":3129}'
        let res = http.put(getBaseUrl() + `/asuno/admin/api/controller/fuse/state/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение fuse состояния контроллера', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/api/controller/fuse/state/?id=3129`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Сброс сенсора пожара', function () {
        // TODO Изменить body после подключения тестового сервера.
        let body = JSON.stringify({
            ids: 324
        })

        let res = http.post(getBaseUrl() + `/asuno/api/reset_fire_sensor/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Создание контроллера', function () {
        // TODO разобраться с {"error": "error", "message": "Ошибка базы данных. Обратитесь в техническую поддержку"}.
        let body = JSON.stringify(
            {
                "name": "Тестовый контроллер" + Math.floor(Math.random() * 999),
                "tcp_ip_addresses": [
                    {
                        "ip_address": "10.10.10.10",
                        "port": 4841,
                        "sim_number": ""
                    }
                ],
                "lighting_installation_class_id": 1,
                "protocol_id": 1,
                "condition_id": 2,
                "manufacturer_id": 1,
                "gis_id": 123,
                "oek_id": Math.floor(Math.random() * 99),
                "address": "123",
                "groups": [
                    1
                ],
                "description": "",
                "placement_type": "",
                "invert_sensor_fire": false,
                "invert_sensor_door_shuno": true,
                "invert_sensor_door_pp": false,
                "ignore_sensor_fire": false,
                "ignore_sensor_door_shuno": false,
                "ignore_sensor_door_pp": false
            }
        )

        let res = http.post(getBaseUrl() + `/asuno/admin/api/controller/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Страница создания контроллера в админке', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/controllers/new/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Список контроллеров в админке', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/controllers/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Админка', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Получение страницы с редактированием контроллера', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/controllers/edit/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Запрос квитирования пункта питания.', function () {
        // TODO Изменить body после подключения тестового сервера.
        let body = JSON.stringify({
            ids: 3129,
            arg: 1
        })

        let res = http.post(getBaseUrl() + `/asuno/api/acknowledged/`, body, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });

    group('Логин в напрямую в админку, данные передаются через form data (username/password)', function () {
        let res = http.get(getBaseUrl() + `/asuno/admin/login/`, getLoginParams());

        check(res, {
            "status is 200": (r) => r.status === 200
        });
        sleep(1);
    });
}

export function tens() {}
export function hundreds() {}
export function thousands() {}

export function handleSummary(data) {
    return {
        "summary.html": htmlReport(data),
    };
}