import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message
} from 'antd';
import { authStorage } from '../../features/auth/model/auth.storage';
import { useNavigate } from 'react-router-dom';
import { createUser, deleteUser, fetchUsers, updateUser } from '../../entities/user/api/user.api';
import { UserList } from '../../entities/user/ui/UserList';
import { User } from '../../entities/user/model/user.types';

export const UsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const [createForm] = Form.useForm<{ name: string; avatar: string }>();
  const [editForm] = Form.useForm<{ id: string; name: string; avatar: string }>();

  const onLogout = () => {
    authStorage.removeToken();
    navigate('/login');
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      message.success('Пользователь создан');
      setIsCreateModalOpen(false);
      createForm.resetFields();
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      message.error(err instanceof Error ? err.message : 'Ошибка создания пользователя');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, avatar }: { id: string; name: string; avatar: string }) =>
      updateUser(id, { name, avatar }),
    onSuccess: async () => {
      message.success('Пользователь обновлён');
      setEditingUser(null);
      editForm.resetFields();
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      message.error(err instanceof Error ? err.message : 'Ошибка обновления пользователя');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      message.success('Пользователь удалён');
      setEditingUser(null);
      editForm.resetFields();
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      message.error(err instanceof Error ? err.message : 'Ошибка удаления пользователя');
    }
  });

  const urlRules = [
    { required: true, message: 'Введите ссылку на аватар' },
    { type: 'url' as const, message: 'Введите корректную ссылку' },
    {
      validator: async (_: unknown, value: string) => {
        if (!value) return;
        if (!/^https?:\/\//i.test(value)) {
          throw new Error('Ссылка должна начинаться с http:// или https://');
        }
      }
    }
  ];

  const openCreateModal = () => {
    createForm.setFieldsValue({
      name: '',
      avatar: ''
    });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      id: user.id,
      name: user.name,
      avatar: user.avatar
    });
  };

  const isCreateBusy = createMutation.isPending;
  const isEditBusy = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Пользователи
        </Typography.Title>
        <Button onClick={onLogout}>Выйти</Button>
      </Space>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreateModal}>
          Создать пользователя
        </Button>
        <Button onClick={() => refetch()} loading={isFetching}>
          Обновить
        </Button>
      </Space>

      {isLoading && (
        <div style={{ padding: '24px 0' }}>
          <Spin />
        </div>
      )}

      {isError && (
        <Alert
          type="error"
          message={error instanceof Error ? error.message : 'Ошибка загрузки пользователей'}
        />
      )}

      {data && <UserList users={data} onUserClick={openEditModal} />}

      <Modal
        title="Создать пользователя"
        open={isCreateModalOpen}
        closable={!isCreateBusy}
        maskClosable={!isCreateBusy}
        keyboard={!isCreateBusy}
        cancelButtonProps={{ disabled: isCreateBusy }}
        okButtonProps={{ disabled: isCreateBusy }}
        onCancel={() => {
          if (isCreateBusy) return;
          setIsCreateModalOpen(false);
        }}
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={isCreateBusy}
        onOk={async () => {
          const values = await createForm.validateFields();
          createMutation.mutate(values);
        }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Иван Иванов" />
          </Form.Item>
          <Form.Item label="Ссылка на аватарку" name="avatar" rules={urlRules}>
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Редактирование пользователя"
        open={Boolean(editingUser)}
        closable={!isEditBusy}
        maskClosable={!isEditBusy}
        keyboard={!isEditBusy}
        onCancel={() => {
          if (isEditBusy) return;
          setEditingUser(null);
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Popconfirm
              title="Удалить пользователя?"
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true, disabled: isEditBusy }}
              cancelButtonProps={{ disabled: isEditBusy }}
              onConfirm={() => {
                if (!editingUser) return;
                deleteMutation.mutate(editingUser.id);
              }}
              disabled={isEditBusy}
            >
              <Button danger disabled={isEditBusy} loading={deleteMutation.isPending}>
                Удалить
              </Button>
            </Popconfirm>

            <Space>
              <Button
                onClick={() => setEditingUser(null)}
                disabled={isEditBusy}
              >
                Отмена
              </Button>
              <Button
                type="primary"
                disabled={isEditBusy}
                loading={updateMutation.isPending}
                onClick={async () => {
                  if (!editingUser) return;
                  const values = await editForm.validateFields();
                  updateMutation.mutate({ id: values.id, name: values.name, avatar: values.avatar });
                }}
              >
                Сохранить
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="id" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Иван Иванов" />
          </Form.Item>
          <Form.Item label="Ссылка на аватарку" name="avatar" rules={urlRules}>
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
