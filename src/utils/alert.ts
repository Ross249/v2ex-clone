import { Alert } from 'react-native';

interface IBaseAlert {
  title?: string;
  message: string;
}

interface IAlert extends IBaseAlert {
  title?: string;
  message: string;
  onPress?: (value?: string | undefined) => void;
}

interface IConfirm extends IBaseAlert {
  onConfirm?: (value?: string | undefined) => void;
  onCancel?: (value?: string | undefined) => void;
}

export const alert = ({ title = 'tips', message, onPress }: IAlert) => {
  Alert.alert(title, message, [{ text: 'confirm', onPress: onPress }]);
};

export const confirm = ({
  title = 'tips',
  message,
  onConfirm,
  onCancel,
}: IConfirm) => {
  Alert.alert(title, message, [
    { text: 'confirm', onPress: onConfirm, style: 'default' },
    { text: 'cancel', onPress: onCancel, style: 'cancel' },
  ]);
};
