import {
    Modal,
    Input,
    Form ,
    Button,
    Space,
    Select,
} from 'ant-design-vue'

export default {
    [Modal.name]: Modal,
    [Input.name]: Input,
    ATextarea: Input.TextArea,
    [Form.name]: Form,
    [Form.Item.name]: Form.Item,
    [Button.name]: Button,
    ASpace: Space,
    [Select.name]: Select,
}
