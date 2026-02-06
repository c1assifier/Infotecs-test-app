import React from 'react';
import { Avatar, List, Typography } from 'antd';
import dayjs from 'dayjs';
import { User } from '../model/user.types';

type Props = {
  users: User[];
  onUserClick?: (user: User) => void;
};

export const UserList = ({ users, onUserClick }: Props) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={users}
      renderItem={(user) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <span
                role="button"
                tabIndex={0}
                style={{ cursor: onUserClick ? 'pointer' : undefined }}
                onClick={() => onUserClick?.(user)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onUserClick?.(user);
                  }
                }}
              >
                <Avatar src={user.avatar} />
              </span>
            }
            title={
              onUserClick ? (
                <Typography.Link onClick={() => onUserClick(user)}>{user.name}</Typography.Link>
              ) : (
                user.name
              )
            }
            description={`Зарегистрирован: ${dayjs(user.createdAt).format('DD.MM.YYYY')}`}
          />
        </List.Item>
      )}
    />
  );
};
