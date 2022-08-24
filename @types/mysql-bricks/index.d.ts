import sql from 'sql-bricks';

declare module 'mysql-bricks' {
  interface InsertStatement extends sql.InsertStatement {
    onDuplicateKeyUpdate(values: any): this;
    ignore(): this;
    from(values: string): this;
  }

  interface UpdateStatement extends sql.UpdateStatement {
    limit(value: number): this;
    orderBy(value: any): this;
  }

  interface SelectStatement extends sql.SelectStatement {
    limit(value: number): this;
    offset(value: number): this;
  }

  interface DeleteStatement extends sql.DeleteStatement {
    limit(value: number): this;
    orderBy(value: any): this;
  }
}
