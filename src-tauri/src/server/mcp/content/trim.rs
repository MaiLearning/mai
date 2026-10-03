//! Обрезка больших содержимых по границе элемента.
//!
//! JSON нельзя резать посередине: агент получает нечитаемый хвост и теряет
//! данные без возможности их восстановить. Поэтому обрезка идёт по коллекции
//! — элементы берутся по порядку, пока укладываются в бюджет, а карты,
//! ключованные по id элемента, фильтруются до оставшихся.
//!
//! Все типы содержимого имеют одну форму — «коллекция + карты по id», поэтому
//! обход один, а различаются только пути: `trim_by_items` получает их конфигом.
//!
//! Тесты — в tests.rs.

#[cfg(test)]
mod tests;

use serde_json::{Map, Value};

/// Обрезанное содержимое вместе с признаком обрезки.
pub struct Trimmed {
    /// Валидный документ: в коллекции оставлены только взятые элементы,
    /// в картах — записи только оставшихся id.
    pub value: Value,
    /// Сколько элементов взято.
    pub shown: usize,
    /// Сколько их было всего.
    pub total: usize,
}

/// Пути полей содержимого: коллекция элементов и карты, ключованные по id.
pub struct TrimPaths<'a> {
    /// Путь к массиву элементов: `content`, `tasks`, `steps`.
    pub items: &'a str,
    /// Пути к объектам, ключи которых — id элементов: `answers`, `results`.
    pub keyed_maps: &'a [&'a str],
    /// Поле id элемента в коллекции.
    pub id: &'a str,
}

/// Обрезает содержимое по путям `paths`, пока не уложится в `budget` символов.
///
/// Возвращает `None`, когда обрезать нечего: структура не по-elementная
/// (нет массива элементов) либо элементов не больше одного — тогда резать
/// не по чему, и решение об отказе принимает вызывающий.
pub fn trim_by_items(raw: &Value, paths: &TrimPaths<'_>, budget: usize) -> Option<Trimmed> {
    let items = raw.get(paths.items)?.as_array()?;
    let total = items.len();
    if total <= 1 {
        return None;
    }

    let mut taken: Vec<Value> = Vec::new();
    let mut used = 0usize;
    for item in items {
        let size = serde_json::to_string(item).map(|s| s.len()).unwrap_or(0);
        if !taken.is_empty() && used + size > budget {
            break;
        }
        used += size;
        taken.push(item.clone());
    }

    if taken.len() == total {
        return None;
    }

    let kept: Vec<String> = taken
        .iter()
        .filter_map(|item| item.get(paths.id).and_then(Value::as_str))
        .map(str::to_string)
        .collect();

    let mut value = match raw {
        Value::Object(map) => map.clone(),
        _ => return None,
    };

    let shown = taken.len();
    if let Some(slot) = value.get_mut(paths.items).and_then(Value::as_array_mut) {
        *slot = taken;
    } else {
        return None;
    }
    for path in paths.keyed_maps {
        filter_map_by_keys(&mut value, path, &kept);
    }

    Some(Trimmed {
        value: Value::Object(value),
        shown,
        total,
    })
}

/// Оставляет в объекте по пути `path` только записи с ключами из `kept`.
fn filter_map_by_keys(value: &mut Map<String, Value>, path: &str, kept: &[String]) {
    let Some(map) = value.get_mut(path).and_then(Value::as_object_mut) else {
        return;
    };
    let filtered: Map<String, Value> = map
        .iter()
        .filter(|(key, _)| kept.iter().any(|k| k == *key))
        .map(|(key, val)| (key.clone(), val.clone()))
        .collect();
    *map = filtered;
}
